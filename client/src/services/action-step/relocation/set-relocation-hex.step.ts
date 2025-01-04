import { Injectable } from "@angular/core";
import { RelocationActionMeta } from "../../../actions/metas/relocation.meta";
import { IsMouseOver } from "../../../actions/rules/is-mouse-over.rule";
import { Step } from "../../../actions/classes/step.class";
import { IsTheNextStep } from "../../../actions/rules/is-the-next-step.rule";
import { Store } from "@ngrx/store";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { Hex, hexToOffset, OffsetCoordinates } from "honeycomb-grid";
import { movePlayer } from "../../../stores/player-position/player-position.actions";
import { moveBall } from "../../../stores/ball-position/ball-position.actions";
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
            this.movePlayer(this.context.hex)
            this.moveBall(this.context.hex)
        } else {
            this.movePlayer(this.actionMeta.playerHex)
            this.moveBall(this.actionMeta.playerHex)
        }
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

    isSelectedHexReachable() {
        const selectedPoint: OffsetCoordinates = this.context.hex;
        return !!this.actionMeta.reachableHexes.getHex(selectedPoint) || false
    }

    
    updateState(): void {
        this.actionMeta.availableNextSteps = [SetRelocationHexStep, RelocatePlayerStep]
        this.store.dispatch(saveActionMeta(this.actionMeta));
    }
}