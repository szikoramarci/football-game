import { Injectable } from "@angular/core";
import { Step } from "../../../actions/classes/step.class";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";
import { IsTheNextStep } from "../../../actions/rules/is-the-next-step.rule";
import { IsReachableHexClicked } from "../../../actions/rules/move/is-reachable-hex-clicked.rule";
import { RelocationActionMeta } from "../../../actions/metas/relocation.action-meta";
import { Store } from "@ngrx/store";
import { clearActionMeta, clearCurrentAction, clearGameContext, setSelectableActions } from "../../../stores/action/action.actions";
import { shiftScenarioTurn } from "../../../stores/relocation/relocation.actions";
import { Hex, hexToOffset } from "honeycomb-grid";
import { movePlayer } from "../../../stores/player-position/player-position.actions";
import { moveBall } from "../../../stores/ball-position/ball-position.actions";

@Injectable({
  providedIn: 'root',
})
export class RelocatePlayerStep extends Step {
    actionMeta!: RelocationActionMeta

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

    movePlayer(coordinates: Hex) {
        this.store.dispatch(movePlayer({
            playerID: this.actionMeta.player.id!, 
            position: hexToOffset(coordinates)
        }));  
    }

    moveBall(coordinates: Hex) {
        if (this.actionMeta.playerHasBall) {            
            this.store.dispatch(moveBall(hexToOffset(coordinates)));
        }
    }

    calculation(): void {
        this.actionMeta = {...this.context.actionMeta as RelocationActionMeta}
    }     

    updateState(): void {
        this.store.dispatch(setSelectableActions({ actions: [] }))
        this.store.dispatch(clearActionMeta())                                
        this.store.dispatch(clearCurrentAction())      
        this.store.dispatch(clearGameContext()) 

        this.movePlayer(this.actionMeta.targetHex!)
        this.moveBall(this.actionMeta.targetHex!)        

        this.store.dispatch(shiftScenarioTurn())       
    }

}