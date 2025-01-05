import { Injectable } from "@angular/core";
import { RelocationActionMeta } from "../../../actions/metas/relocation.action-meta";
import { IsMouseOver } from "../../../actions/rules/is-mouse-over.rule";
import { Step } from "../../../actions/classes/step.class";
import { IsTheNextStep } from "../../../actions/rules/is-the-next-step.rule";
import { Store } from "@ngrx/store";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { OffsetCoordinates } from "honeycomb-grid";
import { RelocatePlayerStep } from "./relocate-player.step";

@Injectable({
  providedIn: 'root',
})
export class SetRelocationHexStep extends Step {
    actionMeta!: RelocationActionMeta

    constructor(
        private store: Store
    ) {
        super()
        this.initRuleSet()       
    }

    initRuleSet(): void {        
        this.addRule(new IsMouseOver());      
        this.addRule(new IsTheNextStep(SetRelocationHexStep));  
    }

    calculation(): void {
        this.actionMeta = {...this.context.actionMeta as RelocationActionMeta}

        if (this.isSelectedHexReachable()) {
            this.actionMeta.targetHex = this.context.hex
        } else {
            this.actionMeta.targetHex = undefined
        }
    }       

    isSelectedHexReachable() {
        const selectedPoint: OffsetCoordinates = this.context.hex;
        return !!this.actionMeta.reachableHexes.getHex(selectedPoint) || false
    }

    
    updateState(): void {
        this.actionMeta.availableNextSteps = [SetRelocationHexStep, RelocatePlayerStep]
        this.store.dispatch(saveActionMeta(this.actionMeta));
    }
}