import { Injectable, Type } from "@angular/core";
import { ActionStepRuleSet } from "../../../action-steps/interfaces/action-step-rule.interface";
import { ActionStepStrategy } from "../../../action-steps/interfaces/action-step-strategy.interface";
import { Store } from "@ngrx/store";
import { ActionStepContext } from "../../../action-steps/interfaces/action-step-context.interface";
import { IsTheNextActionStep } from "../../../action-steps/rules/is-the-next-action.rule";
import { GridService } from "../../grid/grid.service";
import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { saveActionStepMeta } from "../../../stores/action/action.actions";
import { SetMovingPathActionStepMeta } from "../../../action-steps/metas/moving/set-moving-path.action-step-meta";
import { MovePlayerActionStep } from "../move-player/move-player.action.service";
import { IsNotTargetHexClicked } from "../../../action-steps/rules/move/is-not-target-hex-clicked.rule";
import { CancelActionStep } from "../cancel/cancel.service";
import { IsMouseOver } from "../../../action-steps/rules/is-mouse-over.rule";
import { playerMovementEvents } from "../../../stores/player-position/player-position.selector";
import { take } from "rxjs";
import { InitMovingActionStepMeta } from "../../../action-steps/metas/moving/init-moving.action-step-meta";
import { InitStandardPassingActionStep } from "../init-standard-passing/init-standard-passing.action.service";
import { TraverserService } from "../../traverser/traverser.service";
import { ChallengeService } from "../../challenge/challenge.service";

@Injectable({
    providedIn: 'root',
})
export class SetMovingPathActionStep implements ActionStepStrategy {
    ruleSet: ActionStepRuleSet;
    movingPath!: Grid<Hex>;
    lastActionStepMeta!: InitMovingActionStepMeta;
    availableNextActionSteps: Type<ActionStepStrategy>[] = [];
    challengeHexes: Map<string,Hex> = new Map()

    constructor(
        private store: Store,
        private grid: GridService,
        private traverser: TraverserService,
        private challenge: ChallengeService
    ) {
        this.ruleSet = new ActionStepRuleSet();   
        this.ruleSet.addRule(new IsMouseOver());  
        this.ruleSet.addRule(new IsTheNextActionStep(SetMovingPathActionStep));       
        this.ruleSet.addRule(new IsNotTargetHexClicked());
    }

    identify(context: ActionStepContext): boolean {
        return this.ruleSet.validate(context);
    }    

    calculation(context: ActionStepContext): void {
        this.lastActionStepMeta = context.lastActionStepMeta as InitMovingActionStepMeta;

        if (this.isSelectedHexReachable(context)) {
            this.generateMovingPath(context);
            this.generateChallengeHexes();
        } else {
            this.resetMovingPath();
            this.resetChallengeHexes();
        }
        this.generateAvailableNextActionSteps(context);
    }

    isSelectedHexReachable(context: ActionStepContext) {
        const selectedPoint: OffsetCoordinates = context.coordinates;
        return this.lastActionStepMeta.reachableHexes.getHex(selectedPoint) || false
    }

    generateMovingPath(context: ActionStepContext) { 
        const startPoint: OffsetCoordinates = this.lastActionStepMeta.playerCoordinates;
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

        if (!this.lastActionStepMeta.playerHasBall) {
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

    generateAvailableNextActionSteps(context: ActionStepContext) {        
        this.availableNextActionSteps = [SetMovingPathActionStep, CancelActionStep];

        if (this.lastActionStepMeta.playerHasBall){
            this.availableNextActionSteps.push(InitStandardPassingActionStep);
        } 

        if (this.isSelectedHexReachable(context)) {
            this.availableNextActionSteps.push(MovePlayerActionStep)
        }
    }

    updateState(context: ActionStepContext): void {
        const setMovingPathActionMeta: SetMovingPathActionStepMeta = {... this.lastActionStepMeta,             
            timestamp: new Date(),
            availableNextActionSteps: this.availableNextActionSteps,
            clickedCoordinates: context.coordinates, 
            movingPath: this.movingPath,
            targetHex: context.coordinates,
            challengeHexes: this.challengeHexes
        }          
        this.store.dispatch(saveActionStepMeta(setMovingPathActionMeta));        
    }
}