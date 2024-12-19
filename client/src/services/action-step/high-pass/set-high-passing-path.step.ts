import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { equals, OffsetCoordinates } from "honeycomb-grid";
import { Step } from "../../../actions/classes/step.class";
import { GridService } from "../../grid/grid.service";
import { IsMouseOver } from "../../../actions/rules/is-mouse-over.rule";
import { IsTheNextStep } from "../../../actions/rules/is-the-next-step.rule";
import { HighPassActionMeta } from "../../../actions/metas/high-pass.action-meta";
import { saveActionMeta } from "../../../stores/action/action.actions";

@Injectable({
    providedIn: 'root',
})
export class SetHighPassingPathStep extends Step {    
    actionMeta!: HighPassActionMeta

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

    calculation(): void {
        this.actionMeta = {...this.context.actionMeta as HighPassActionMeta}

        if (this.isSelectedHexPassable()) {
            this.collectPossibleHeadingPlayer()
            this.generatePassingPath()
        } else {
            this.resetPassingPath()
        }
        this.generateAvailableNextSteps()
    }

    isSelectedHexPassable() {
        const selectedPoint: OffsetCoordinates = this.context.hex;
        return this.actionMeta.availableTargets.getHex(selectedPoint) || false
    }

    generatePassingPath() {  
        const startCoordinate: OffsetCoordinates = this.actionMeta.playerHex;       
        const startHex = this.grid.getHex(startCoordinate)
        const endHex = this.grid.getHex(this.context.hex)

        if (startHex && endHex) {        
            this.actionMeta.passingPath = [startHex, endHex]   
        }             
    }    

    resetPassingPath() {
        this.actionMeta.passingPath = []
    }

    collectPossibleHeadingPlayer() {
        this.actionMeta.possibleHeadingPlayers!.forEach((availableTargets, playerPosition) => {
            if (availableTargets.some(availableTarget => equals(availableTarget, this.context.hex))) {
                console.log(playerPosition)
            }
        })
    }

    generateAvailableNextSteps() {        
        this.actionMeta.availableNextSteps = [SetHighPassingPathStep];
    }

    updateState(): void {         
        this.store.dispatch(saveActionMeta(this.actionMeta));        
    }
}
