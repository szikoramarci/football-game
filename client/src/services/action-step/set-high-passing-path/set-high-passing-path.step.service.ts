import { Injectable, Type } from "@angular/core";
import { StepRuleSet } from "../../../action-steps/interfaces/step-rule.interface";
import { Step } from "../../../action-steps/interfaces/step.interface";
import { Store } from "@ngrx/store";
import { StepContext } from "../../../action-steps/interfaces/step-context.interface";
import { IsTheNextStep } from "../../../action-steps/rules/is-the-next-step.rule";
import { GridService } from "../../grid/grid.service";
import { equals, Hex, OffsetCoordinates } from "honeycomb-grid";
import { saveStepMeta } from "../../../stores/action/action.actions";
import { CancelStep } from "../cancel/cancel.service";
import { IsMouseOver } from "../../../action-steps/rules/is-mouse-over.rule";
import { InitHighPassingStepMeta } from "../../../action-steps/metas/passing/high-passing/init-high-passing.step-meta";
import { SetHighPassingPathStepMeta } from "../../../action-steps/metas/passing/high-passing/set-high-passing-path.step-meta";

@Injectable({
    providedIn: 'root',
})
export class SetHighPassingPathStep implements Step {
    ruleSet: StepRuleSet
    passingPath!: Hex[]
    lastStepMeta!: InitHighPassingStepMeta
    availableSteps: Type<Step>[] = []

    constructor(
        private store: Store,
        private grid: GridService
    ) {
        this.ruleSet = new StepRuleSet();   
        this.ruleSet.addRule(new IsMouseOver());  
        this.ruleSet.addRule(new IsTheNextStep(SetHighPassingPathStep));                   
    }

    identify(context: StepContext): boolean {
        return this.ruleSet.validate(context);
    }

    calculation(context: StepContext): void {
        this.lastStepMeta = context.lastStepMeta as InitHighPassingStepMeta;

        if (this.isSelectedHexPassable(context)) {
            this.collectPossibleHeadingPlayer(context)
            this.generatePassingPath(context)
        } else {
            this.resetPassingPath()
        }
        this.generateAvailableNextSteps()
    }

    isSelectedHexPassable(context: StepContext) {
        const selectedPoint: OffsetCoordinates = context.coordinates;
        return this.lastStepMeta.availableTargets.getHex(selectedPoint) || false
    }

    generatePassingPath(context: StepContext) {  
        const startCoordinate: OffsetCoordinates = this.lastStepMeta.playerCoordinates;       
        const startHex = this.grid.getHex(startCoordinate)
        const endHex = this.grid.getHex(context.coordinates)

        if (startHex && endHex) {        
            this.passingPath = [startHex, endHex]   
        }             
    }    

    resetPassingPath() {
        this.passingPath = []
    }

    collectPossibleHeadingPlayer(context: StepContext) {
        this.lastStepMeta.possibleHeadingPlayers.forEach((availableTargets, playerPosition) => {
            if (availableTargets.some(availableTarget => equals(availableTarget, context.coordinates))) {
                console.log(playerPosition)
            }
        })
    }

    generateAvailableNextSteps() {        
        this.availableSteps = [SetHighPassingPathStep, CancelStep];
    }

    updateState(context: StepContext): void {
        const setHighPassingPathStepMeta: SetHighPassingPathStepMeta = {... this.lastStepMeta,             
            timestamp: new Date(),
            availableNextSteps: this.availableSteps,
            clickedCoordinates: context.coordinates, 
            passingPath: this.passingPath,            
            targetHex: context.coordinates,
        }          
        this.store.dispatch(saveStepMeta(setHighPassingPathStepMeta));        
    }
}
