import { Injectable } from "@angular/core";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { IsOwnPlayer } from "../../../actions/rules/pick-up-player/is-own-player.rule";
import { Store } from "@ngrx/store";
import { PickUpPlayerActionMeta } from "../../../actions/metas/pick-up-player.action.meta";
import { SetMovingPathAction } from "../set-moving-path/set-moving-path.action.service";
import { IsAvailableNextActionsEmpty } from "../../../actions/rules/is-available-next-actions-empty.rule";
import { IsPlayerSelected } from "../../../actions/rules/pick-up-player/is-player-selected.rule";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { GridService } from "../../grid/grid.service";
import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { getFreeCoordinatesInGrid, getPlayerByPosition } from "../../../stores/player-position/player-position.selector";

@Injectable({
  providedIn: 'root',
})
export class PickUpPlayerAction implements ActionStrategy {
    ruleSet: ActionRuleSet;
    reachableHexes!: Grid<Hex>;
  
    constructor(
      private store: Store,
      private grid: GridService
    ) {
      this.ruleSet = new ActionRuleSet();
      this.ruleSet.addRule(new IsAvailableNextActionsEmpty());
      this.ruleSet.addRule(new IsOwnPlayer());
      this.ruleSet.addRule(new IsPlayerSelected());
    }
  
    identify(context: ActionContext): boolean {
      return this.ruleSet.validate(context);
    }
  
    calculation(context: ActionContext): void {
      const centralPoint = context.coordinates;
      const distance = context.player?.speed || 0;
      const hexesInDistance = this.grid.getHexesInDistance(centralPoint, distance);
      this.store.select(getFreeCoordinatesInGrid(hexesInDistance)).subscribe(reachableHexes => {
        this.reachableHexes = reachableHexes;
      })
    }
  
    updateState(context: ActionContext): void {
      const pickUpPlayerActionMeta: PickUpPlayerActionMeta = {
        timestamp: new Date(),
        clickedCoordinates: context.coordinates,
        playerCoordinates: context.coordinates,
        availableNextActions: [SetMovingPathAction],
        reachableHexes: this.reachableHexes
      }
      this.store.dispatch(saveActionMeta(pickUpPlayerActionMeta));
    }
  }