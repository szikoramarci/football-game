import { Injectable } from "@angular/core";
import { Step } from "../../../actions/classes/step.class";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";
import { IsTheNextStep } from "../../../actions/rules/is-the-next-step.rule";
import { IsReachableHexClicked } from "../../../actions/rules/move/is-reachable-hex-clicked.rule";
import { RelocationActionMeta } from "../../../actions/metas/relocation.meta";
import { Store } from "@ngrx/store";
import { clearActionMeta, clearCurrentAction, clearGameContext, setSelectableActions } from "../../../stores/action/action.actions";
import { moveBall } from "../../../stores/ball-position/ball-position.actions";
import { movePlayer } from "../../../stores/player-position/player-position.actions";
import { Hex } from "honeycomb-grid";
import { shiftScenarioTurn } from "../../../stores/relocation/relocation.actions";

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

    calculation(): void {
        this.actionMeta = {...this.context.actionMeta as RelocationActionMeta}
    }  

    movePlayer(coordinates: Hex) {
        this.store.dispatch(movePlayer({
            playerID: this.actionMeta.player.id!, 
            position: coordinates
        }));  
    }

    moveBall(coordinates: Hex) {
        if (this.actionMeta.playerHasBall) {
            this.store.dispatch(moveBall(coordinates));
        }
    }

    updateState(): void {
        this.store.dispatch(setSelectableActions({ actions: [] }))
        this.store.dispatch(clearActionMeta())                                
        this.store.dispatch(clearCurrentAction())      
        this.store.dispatch(clearGameContext()) 

        this.store.dispatch(shiftScenarioTurn())

        this.movePlayer(this.context.hex)
        this.moveBall(this.context.hex)
    }

}