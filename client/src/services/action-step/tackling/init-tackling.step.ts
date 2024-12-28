import { Injectable } from "@angular/core";
import { Step } from "../../../actions/classes/step.class";
import { AreAvailableNextStepsEmpty } from "../../../actions/rules/is-available-next-actions-empty.rule";
import { TacklingActionMeta } from "../../../actions/metas/tackling.action-meta";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { Grid, Hex } from "honeycomb-grid";
import { Store } from "@ngrx/store";
import { TacklingHelperService } from "../../action-helper/tackling-helper.service";
import { PlayerWithPosition } from "../../../interfaces/player-with-position.interface";
import { SetTacklingHexStep } from "./set-tackling-hex.step";

@Injectable({
  providedIn: 'root',
})
export class InitTacklingStep extends Step {

  possibleTacklingHexes!: Grid<Hex>

  constructor(
    private store: Store,
    private tacklingHelper: TacklingHelperService
  ) {
      super()
      this.initRuleSet()
  }

  initRuleSet() {
      this.addRule(new AreAvailableNextStepsEmpty());
  }

  calculation(): void {
    this.generatePossibleTacklingHexes()
  }

  generatePossibleTacklingHexes() {
    const playerWithPosition: PlayerWithPosition = {
      player: this.context.player!,
      position: this.context.hex
    }

    this.possibleTacklingHexes = this.tacklingHelper.generatePossibleTacklingHexes(playerWithPosition)
  }   
  
  updateState(): void {
    const tacklingActionMeta: TacklingActionMeta = {
      player: this.context.player!,
      playerHex: this.context.hex,
      clickedHex: this.context.hex,
      possibleTacklingHexes: this.possibleTacklingHexes,
      availableNextSteps: [SetTacklingHexStep]  
    }      
    this.store.dispatch(saveActionMeta(tacklingActionMeta));      
  }
  
}