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
import { getBallPosition } from "../../../stores/ball-position/ball-position.selector";
import { Player } from "../../../models/player.model";
import { GridService } from "../../grid/grid.service";
import { PlayerService } from "../../player/player.service";

@Injectable({
  providedIn: 'root',
})
export class InitTacklingStep extends Step {

  possibleTacklingHexes!: Grid<Hex>
  ballerAdjacentHexes!: Grid<Hex>
  ballHex!: Hex
  ballerPlayer!: Player

  constructor(
    private store: Store,
    private tacklingHelper: TacklingHelperService,
    private grid: GridService,
    private player: PlayerService
  ) {
      super()
      this.initRuleSet()
      this.initSubsriptions()
  }

  initRuleSet() {
      this.addRule(new AreAvailableNextStepsEmpty());
  }

  initSubsriptions() {
    const ballPositionSubscription = this.store.select(getBallPosition()).subscribe(ballPosition => {
      this.ballHex = this.grid.getHex(ballPosition)!
      this.player.getPlayerOnCoordinates(ballPosition).subscribe(player => {
        this.ballerPlayer = player!
      })
    })
    this.addSubscription(ballPositionSubscription)
}

  calculation(): void {
    this.generatePossibleTacklingHexes()
    this.generateBallerAdjacentHexes()
  }

  generatePossibleTacklingHexes() {
    const playerWithPosition: PlayerWithPosition = {
      player: this.context.player!,
      position: this.context.hex
    }

    this.possibleTacklingHexes = this.tacklingHelper.generatePossibleTacklingHexes(playerWithPosition)
  }   

  generateBallerAdjacentHexes() {
    this.player.getFreeAdjacentHexesByPlayerID(this.ballerPlayer.id).subscribe(ballerAdjacentHexes => {
      this.ballerAdjacentHexes = ballerAdjacentHexes
    })
  }
  
  updateState(): void {
    const tacklingActionMeta: TacklingActionMeta = {
      player: this.context.player!,
      playerHex: this.context.hex,
      ballerPlayer: this.ballerPlayer,
      ballHex: this.ballHex,
      ballerAdjacentHexes: this.ballerAdjacentHexes,
      clickedHex: this.context.hex,
      possibleTacklingHexes: this.possibleTacklingHexes,      
      availableNextSteps: [SetTacklingHexStep]  
    }      
    this.store.dispatch(saveActionMeta(tacklingActionMeta));      
  }
  
}