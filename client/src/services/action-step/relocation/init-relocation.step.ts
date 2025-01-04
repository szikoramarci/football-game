import { Injectable, Type } from "@angular/core";
import { Step } from "../../../actions/classes/step.class";
import { Store } from "@ngrx/store";
import { AreAvailableNextStepsEmpty } from "../../../actions/rules/is-available-next-actions-empty.rule";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { Grid, Hex } from "honeycomb-grid";
import { RelocationActionMeta } from "../../../actions/metas/relocation.meta";
import { getCurrentRelocationTurn } from "../../../stores/relocation/relocation.selector";
import { RelocationTurn } from "../../../relocation/relocation-turn.interface";
import { GridService } from "../../grid/grid.service";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";
import { SetRelocationHexStep } from "./set-relocation-hex.step";

@Injectable({
  providedIn: 'root',
})
export class InitRelocationStep extends Step {
    reachableHexes!: Grid<Hex>;
    availableNextSteps: Type<Step>[] = [];
    currentRelocationTurn!: RelocationTurn
  
    constructor(
      private store: Store,
      private grid: GridService
    ) {
      super()     
      this.initSubscriptions()
    }

    initRuleSet() {      
      this.addRule(new IsLeftClick())
      this.addRule(new AreAvailableNextStepsEmpty());
    }

    initSubscriptions() {     
      const currentRelocationTurnSubscriptions = this.store.select(getCurrentRelocationTurn()).subscribe(currentRelocationTurn => {                        
          this.currentRelocationTurn =  currentRelocationTurn
      })    
      this.addSubscription(currentRelocationTurnSubscriptions)
    }
  
    calculation(): void {      
      this.generateReachableHexes();          
    }

    generateReachableHexes() {      
      this.reachableHexes = this.grid.getGrid().filter(hex => {
        if (this.currentRelocationTurn.allowedTargets === undefined) return false 
        return this.currentRelocationTurn.allowedTargets(hex)
      })
    }        

    updateState(): void {
      const relocationActionMeta: RelocationActionMeta = {
        clickedHex: this.context.hex,
        playerHex: this.context.hex,   
        player: this.context.player!,
        playerHasBall: this.context.playerHasBall,
        availableNextSteps: [SetRelocationHexStep],
        reachableHexes: this.reachableHexes
      }      
      this.store.dispatch(saveActionMeta(relocationActionMeta));      
    }
  }