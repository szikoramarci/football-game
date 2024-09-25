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
import { playerMovementEvents } from "../../../stores/player-position/player-position.selector";
import { CancelMovingPlayerAction } from "../cancel-moving-player/cancel-moving-player.service";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";
import { take } from "rxjs";
import { InitMovingActionMeta } from "../../../actions/metas/init-moving.action.meta";

@Injectable({
  providedIn: 'root',
})
export class InitPassingAction implements ActionStrategy {
    ruleSet: ActionRuleSet;
    reachableHexes!: Grid<Hex>;
  
    constructor(
      private store: Store,
      private grid: GridService
    ) {
      this.ruleSet = new ActionRuleSet();
      this.ruleSet.addRule(new IsLeftClick());
      this.ruleSet.addRule(new IsAvailableNextActionsEmpty());
      this.ruleSet.addRule(new IsPlayerSelected());
      this.ruleSet.addRule(new IsOwnPlayer());
    }
  
    identify(context: ActionContext): boolean {
      return this.ruleSet.validate(context);
    }
  
    calculation(context: ActionContext): void {
      const centralPoint = context.coordinates;
      const distance = context.player?.speed || 0;      
      this.store.select(playerMovementEvents).pipe(take(1))
      .subscribe((occupiedCoordinates) => {
        const offsetCoordinates: OffsetCoordinates[] = Object.values(occupiedCoordinates)        
        const occupiedHexes = this.grid.createGrid().setHexes(offsetCoordinates).setHexes(this.grid.getFrame());
        this.reachableHexes = this.grid.getReachableHexes(centralPoint, distance, occupiedHexes);
      })
    }
  
    updateState(context: ActionContext): void {
      const initMovingActionMeta: InitMovingActionMeta = {
        timestamp: new Date(),
        clickedCoordinates: context.coordinates,
        playerCoordinates: context.coordinates,
        playerID: context.player?.id,
        availableNextActions: [SetMovingPathAction, CancelMovingPlayerAction],
        reachableHexes: this.reachableHexes
      }
      this.store.dispatch(saveActionMeta(initMovingActionMeta));
    }
  }