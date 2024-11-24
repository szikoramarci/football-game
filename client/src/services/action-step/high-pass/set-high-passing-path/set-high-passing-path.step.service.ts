import { Injectable, Type } from "@angular/core";
import { Store } from "@ngrx/store";
import { equals, Hex, OffsetCoordinates } from "honeycomb-grid";
import { Step } from "../../../../action-steps/classes/step.class";
import { InitHighPassingStepMeta } from "../../../../action-steps/metas/passing/high-passing/init-high-passing.step-meta";
import { GridService } from "../../../grid/grid.service";
import { IsMouseOver } from "../../../../action-steps/rules/is-mouse-over.rule";
import { IsTheNextStep } from "../../../../action-steps/rules/is-the-next-step.rule";
import { StepContext } from "../../../../action-steps/classes/step-context.interface";
import { CancelStep } from "../../cancel/cancel.service";
import { SetHighPassingPathStepMeta } from "../../../../action-steps/metas/passing/high-passing/set-high-passing-path.step-meta";
import { saveStepMeta } from "../../../../stores/action/action.actions";

@Injectable({
    providedIn: 'root',
})
export class SetHighPassingPathStep extends Step {
    passingPath!: Hex[]
    lastStepMeta!: InitHighPassingStepMeta
    availableSteps: Type<Step>[] = []

    constructor(
        private store: Store,
        private grid: GridService
    ) {
        super()
        this.initRuleSet()                        
    }

    initRuleSet(): void {
        this.addRule(new IsMouseOver());  
        this.addRule(new IsTheNextStep(SetHighPassingPathStep));   
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
            availableNextSteps: this.availableSteps,
            clickedCoordinates: context.coordinates, 
            passingPath: this.passingPath,            
            targetHex: context.coordinates,
        }          
        this.store.dispatch(saveStepMeta(setHighPassingPathStepMeta));        
    }
}
