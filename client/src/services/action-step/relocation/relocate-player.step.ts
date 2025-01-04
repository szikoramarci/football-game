import { Injectable } from "@angular/core";
import { Step } from "../../../actions/classes/step.class";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";
import { IsTheNextStep } from "../../../actions/rules/is-the-next-step.rule";
import { IsReachableHexClicked } from "../../../actions/rules/move/is-reachable-hex-clicked.rule";
import { RelocationActionMeta } from "../../../actions/metas/relocation.meta";
import { Store } from "@ngrx/store";
import { clearActionMeta, clearCurrentAction, clearGameContext, setSelectableActions } from "../../../stores/action/action.actions";
import { shiftScenarioTurn } from "../../../stores/relocation/relocation.actions";

@Injectable({
  providedIn: 'root',
})
export class RelocatePlayerStep extends Step {

    constructor(
        private store: Store
    ) {
        super()
        this.initRuleSet()       
    }

    initRuleSet(): void {        
        this.addRule(new IsLeftClick());      
        this.addRule(new IsTheNextStep(RelocatePlayerStep));  
        this.addRule(new IsReachableHexClicked()); 
    }

    calculation(): void {}     

    updateState(): void {
        this.store.dispatch(setSelectableActions({ actions: [] }))
        this.store.dispatch(clearActionMeta())                                
        this.store.dispatch(clearCurrentAction())      
        this.store.dispatch(clearGameContext()) 

        this.store.dispatch(shiftScenarioTurn())       
    }

}