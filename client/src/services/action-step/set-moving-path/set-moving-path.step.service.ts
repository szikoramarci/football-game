import { Injectable, Type } from "@angular/core";
import { StepRuleSet } from "../../../action-steps/interfaces/step-rule.interface";
import { Step } from "../../../action-steps/interfaces/step.interface";
import { Store } from "@ngrx/store";
import { StepContext } from "../../../action-steps/interfaces/step-context.interface";
import { IsTheNextStep } from "../../../action-steps/rules/is-the-next-step.rule";
import { GridService } from "../../grid/grid.service";
import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { saveStepMeta } from "../../../stores/action/action.actions";
import { SetMovingPathStepMeta } from "../../../action-steps/metas/moving/set-moving-path.step-meta";
import { MovePlayerStep } from "../move-player/move-player.step.service";
import { IsNotTargetHexClicked } from "../../../action-steps/rules/move/is-not-target-hex-clicked.rule";
import { CancelStep } from "../cancel/cancel.service";
import { IsMouseOver } from "../../../action-steps/rules/is-mouse-over.rule";
import { playerMovementEvents } from "../../../stores/player-position/player-position.selector";
import { take } from "rxjs";
import { InitMovingStepMeta } from "../../../action-steps/metas/moving/init-moving.step-meta";
import { InitStandardPassingStep } from "../init-standard-passing/init-standard-passing.step.service";
import { TraverserService } from "../../traverser/traverser.service";
import { ChallengeService } from "../../challenge/challenge.service";

@Injectable({
    providedIn: 'root',
})
export class SetMovingPathStep implements Step {
    ruleSet: StepRuleSet;
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
        this.ruleSet = new StepRuleSet();   
        this.ruleSet.addRule(new IsMouseOver());  
        this.ruleSet.addRule(new IsTheNextStep(SetMovingPathStep));       
        this.ruleSet.addRule(new IsNotTargetHexClicked());
    }

    identify(context: StepContext): boolean {
        return this.ruleSet.validate(context);
    }    

    calculation(context: StepContext): void {
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

    isSelectedHexReachable(context: StepContext) {
        const selectedPoint: OffsetCoordinates = context.coordinates;
        return this.lastStepMeta.reachableHexes.getHex(selectedPoint) || false
    }

    generateMovingPath(context: StepContext) { 
        const startPoint: OffsetCoordinates = this.lastStepMeta.playerCoordinates;
        const endPoint: OffsetCoordinates = context.coordinates;        
        this.store.select(playerMovementEvents).pipe(take(1))
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

        this.challenge.generateChallengeHexes(this.movingPath.toArray(), 1).subscribe(challengeHexes => {
            this.challengeHexes = challengeHexes
        })         
    }

    resetMovingPath() {
        this.movingPath = this.grid.createGrid();
    }

    resetChallengeHexes() {
        this.challengeHexes = new Map();
    }

    generateAvailableNextSteps(context: StepContext) {        
        this.availableNextSteps = [SetMovingPathStep, CancelStep];

        if (this.lastStepMeta.playerHasBall){
            this.availableNextSteps.push(InitStandardPassingStep);
        } 

        if (this.isSelectedHexReachable(context)) {
            this.availableNextSteps.push(MovePlayerStep)
        }
    }

    updateState(context: StepContext): void {
        const setMovingPathStepMeta: SetMovingPathStepMeta = {... this.lastStepMeta,             
            timestamp: new Date(),
            availableNextSteps: this.availableNextSteps,
            clickedCoordinates: context.coordinates, 
            movingPath: this.movingPath,
            targetHex: context.coordinates,
            challengeHexes: this.challengeHexes
        }          
        this.store.dispatch(saveStepMeta(setMovingPathStepMeta));        
    }
}