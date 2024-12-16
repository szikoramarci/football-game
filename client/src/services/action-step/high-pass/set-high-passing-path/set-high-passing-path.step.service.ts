import { Injectable, Type } from "@angular/core";
import { Store } from "@ngrx/store";
import { equals, Hex, OffsetCoordinates } from "honeycomb-grid";
import { Step } from "../../../../actions/classes/step.class";
import { InitHighPassingStepMeta } from "../../../../actions/metas/passing/high-passing/init-high-passing.step-meta";
import { GridService } from "../../../grid/grid.service";
import { IsMouseOver } from "../../../../actions/rules/is-mouse-over.rule";
import { IsTheNextStep } from "../../../../actions/rules/is-the-next-step.rule";
import { GameContext } from "../../../../actions/classes/game-context.interface";
import { CancelStep } from "../../cancel/cancel.service";
import { SetHighPassingPathStepMeta } from "../../../../actions/metas/passing/high-passing/set-high-passing-path.step-meta";
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

    calculation(context: GameContext): void {
        this.lastStepMeta = context.lastStepMeta as InitHighPassingStepMeta;

        if (this.isSelectedHexPassable(context)) {
            this.collectPossibleHeadingPlayer(context)
            this.generatePassingPath(context)
        } else {
            this.resetPassingPath()
        }
        this.generateAvailableNextSteps()
    }

    isSelectedHexPassable(context: GameContext) {
        const selectedPoint: OffsetCoordinates = context.hex;
        return this.lastStepMeta.availableTargets.getHex(selectedPoint) || false
    }

    generatePassingPath(context: GameContext) {  
        const startCoordinate: OffsetCoordinates = this.lastStepMeta.playerHex;       
        const startHex = this.grid.getHex(startCoordinate)
        const endHex = this.grid.getHex(context.hex)

        if (startHex && endHex) {        
            this.passingPath = [startHex, endHex]   
        }             
    }    

    resetPassingPath() {
        this.passingPath = []
    }

    collectPossibleHeadingPlayer(context: GameContext) {
        this.lastStepMeta.possibleHeadingPlayers.forEach((availableTargets, playerPosition) => {
            if (availableTargets.some(availableTarget => equals(availableTarget, context.hex))) {
                console.log(playerPosition)
            }
        })
    }

    generateAvailableNextSteps() {        
        this.availableSteps = [SetHighPassingPathStep, CancelStep];
    }

    updateState(context: GameContext): void {
        const setHighPassingPathStepMeta: SetHighPassingPathStepMeta = {... this.lastStepMeta,             
            availableNextSteps: this.availableSteps,
            clickedHex: context.hex, 
            passingPath: this.passingPath,            
            targetHex: context.hex,
        }          
        this.store.dispatch(saveStepMeta(setHighPassingPathStepMeta));        
    }
}
