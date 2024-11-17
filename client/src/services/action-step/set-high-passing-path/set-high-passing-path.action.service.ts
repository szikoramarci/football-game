import { Injectable, Type } from "@angular/core";
import { ActionStepRuleSet } from "../../../action-steps/interfaces/action-step-rule.interface";
import { ActionStepStrategy } from "../../../action-steps/interfaces/action-step-strategy.interface";
import { Store } from "@ngrx/store";
import { ActionStepContext } from "../../../action-steps/interfaces/action-step-context.interface";
import { IsTheNextActionStep } from "../../../action-steps/rules/is-the-next-action.rule";
import { GridService } from "../../grid/grid.service";
import { equals, Hex, OffsetCoordinates } from "honeycomb-grid";
import { saveActionStepMeta } from "../../../stores/action/action.actions";
import { CancelActionStep } from "../cancel/cancel.service";
import { IsMouseOver } from "../../../action-steps/rules/is-mouse-over.rule";
import { InitHighPassingActionStepMeta } from "../../../action-steps/metas/passing/high-passing/init-high-passing.action-step-meta";
import { SetHighPassingPathActionStepMeta } from "../../../action-steps/metas/passing/high-passing/set-high-passing-path.action-step-meta";

@Injectable({
    providedIn: 'root',
})
export class SetHighPassingPathActionStep implements ActionStepStrategy {
    ruleSet: ActionStepRuleSet
    passingPath!: Hex[]
    lastActionStepMeta!: InitHighPassingActionStepMeta
    availableNextActionSteps: Type<ActionStepStrategy>[] = []

    constructor(
        private store: Store,
        private grid: GridService
    ) {
        this.ruleSet = new ActionStepRuleSet();   
        this.ruleSet.addRule(new IsMouseOver());  
        this.ruleSet.addRule(new IsTheNextActionStep(SetHighPassingPathActionStep));                   
    }

    identify(context: ActionStepContext): boolean {
        return this.ruleSet.validate(context);
    }

    calculation(context: ActionStepContext): void {
        this.lastActionStepMeta = context.lastActionStepMeta as InitHighPassingActionStepMeta;

        if (this.isSelectedHexPassable(context)) {
            this.collectPossibleHeadingPlayer(context)
            this.generatePassingPath(context)
        } else {
            this.resetPassingPath()
        }
        this.generateAvailableNextActionSteps()
    }

    isSelectedHexPassable(context: ActionStepContext) {
        const selectedPoint: OffsetCoordinates = context.coordinates;
        return this.lastActionStepMeta.availableTargets.getHex(selectedPoint) || false
    }

    generatePassingPath(context: ActionStepContext) {  
        const startCoordinate: OffsetCoordinates = this.lastActionStepMeta.playerCoordinates;       
        const startHex = this.grid.getHex(startCoordinate)
        const endHex = this.grid.getHex(context.coordinates)

        if (startHex && endHex) {        
            this.passingPath = [startHex, endHex]   
        }             
    }    

    resetPassingPath() {
        this.passingPath = []
    }

    collectPossibleHeadingPlayer(context: ActionStepContext) {
        this.lastActionStepMeta.possibleHeadingPlayers.forEach((availableTargets, playerPosition) => {
            if (availableTargets.some(availableTarget => equals(availableTarget, context.coordinates))) {
                console.log(playerPosition)
            }
        })
    }

    generateAvailableNextActionSteps() {        
        this.availableNextActionSteps = [SetHighPassingPathActionStep, CancelActionStep];
    }

    updateState(context: ActionStepContext): void {
        const setHighPassingPathActionMeta: SetHighPassingPathActionStepMeta = {... this.lastActionStepMeta,             
            timestamp: new Date(),
            availableNextActionSteps: this.availableNextActionSteps,
            clickedCoordinates: context.coordinates, 
            passingPath: this.passingPath,            
            targetHex: context.coordinates,
        }          
        this.store.dispatch(saveActionStepMeta(setHighPassingPathActionMeta));        
    }
}
