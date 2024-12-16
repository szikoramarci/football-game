import { Injectable, Type } from "@angular/core";
import { Step } from "../../../../actions/classes/step.class";
import { Store } from "@ngrx/store";
import { IsTheNextStep } from "../../../../actions/rules/is-the-next-step.rule";
import { GridService } from "../../../grid/grid.service";
import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { saveStepMeta } from "../../../../stores/action/action.actions";
import { SetMovingPathStepMeta } from "../../../../actions/metas/moving/set-moving-path.step-meta";
import { MovePlayerStep } from "../move-player/move-player.step.service";
import { IsNotTargetHexClicked } from "../../../../actions/rules/move/is-not-target-hex-clicked.rule";
import { CancelStep } from "../../cancel/cancel.service";
import { IsMouseOver } from "../../../../actions/rules/is-mouse-over.rule";
import { getPlayerPositions } from "../../../../stores/player-position/player-position.selector";
import { take } from "rxjs";
import { InitMovingStepMeta } from "../../../../actions/metas/moving/init-moving.step-meta";
import { TraverserService } from "../../../traverser/traverser.service";
import { ChallengeService } from "../../../challenge/challenge.service";
import { GameContext } from "../../../../actions/classes/game-context.interface";
import { InitStandardPassingStep } from "../../standard-pass/init-standard-passing/init-standard-passing.step.service";

@Injectable({
    providedIn: 'root',
})
export class SetMovingPathStep extends Step {
    movingPath!: Grid<Hex>;
    lastStepMeta!: InitMovingStepMeta;
    availableNextSteps: Type<Step>[] = [];
    challengeHexes: Map<string,Hex> = new Map()

    constructor(
        private store: Store,
        private grid: GridService,
        private traverser: TraverserService,
        private challenge: ChallengeService
    ) {
        super()
        this.initRuleSet()
    }

    initRuleSet(): void {
        this.addRule(new IsMouseOver());  
        this.addRule(new IsTheNextStep(SetMovingPathStep));       
        this.addRule(new IsNotTargetHexClicked());
    } 

    calculation(context: GameContext): void {
        this.lastStepMeta = context.lastStepMeta as InitMovingStepMeta;

        if (this.isSelectedHexReachable(context)) {
            this.generateMovingPath(context);
            this.generateChallengeHexes();
        } else {
            this.resetMovingPath();
            this.resetChallengeHexes();
        }
        this.generateAvailableNextSteps(context);
    }

    isSelectedHexReachable(context: GameContext) {
        const selectedPoint: OffsetCoordinates = context.hex;
        return this.lastStepMeta.reachableHexes.getHex(selectedPoint) || false
    }

    generateMovingPath(context: GameContext) { 
        const startPoint: OffsetCoordinates = this.lastStepMeta.playerHex;
        const endPoint: OffsetCoordinates = context.hex;        
        this.store.select(getPlayerPositions).pipe(take(1))
        .subscribe((occupiedCoordinates) => {
            const offsetCoordinates: OffsetCoordinates[] = Object.values(occupiedCoordinates)        
            const occupiedHexes = this.grid.createGrid().setHexes(offsetCoordinates).setHexes(this.grid.getFrame());         
            this.movingPath = this.traverser.getPathHexes(startPoint, endPoint, occupiedHexes);
        })
    }

    generateChallengeHexes() {
        this.resetChallengeHexes();

        if (!this.lastStepMeta.playerHasBall) {
            return
        }

        this.challengeHexes = this.challenge.generateChallengeHexes(this.movingPath.toArray(), 1)         
    }

    resetMovingPath() {
        this.movingPath = this.grid.createGrid();
    }

    resetChallengeHexes() {
        this.challengeHexes = new Map();
    }

    generateAvailableNextSteps(context: GameContext) {        
        this.availableNextSteps = [SetMovingPathStep, CancelStep];

        if (this.lastStepMeta.playerHasBall){
            this.availableNextSteps.push(InitStandardPassingStep);
        } 

        if (this.isSelectedHexReachable(context)) {
            this.availableNextSteps.push(MovePlayerStep)
        }
    }

    updateState(context: GameContext): void {
        const setMovingPathStepMeta: SetMovingPathStepMeta = {... this.lastStepMeta,             
            availableNextSteps: this.availableNextSteps,
            clickedHex: context.hex, 
            movingPath: this.movingPath,
            targetHex: context.hex,
            challengeHexes: this.challengeHexes
        }          
        this.store.dispatch(saveStepMeta(setMovingPathStepMeta));        
    }
}