import { Injectable, Type } from "@angular/core";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { IsOwnPlayer } from "../../../actions/rules/pick-up-player/is-own-player.rule";
import { Store } from "@ngrx/store";
import { PickUpPlayerActionMeta } from "../../../actions/metas/pick-up-player.action.meta";
import { IsAvailableNextActionsEmpty } from "../../../actions/rules/is-available-next-actions-empty.rule";
import { IsPlayerSelected } from "../../../actions/rules/pick-up-player/is-player-selected.rule";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { GridService } from "../../grid/grid.service";
import { Grid, Hex } from "honeycomb-grid";
import { CancelMovingPlayerAction } from "../cancel-moving-player/cancel-moving-player.service";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";
import { InitMovingAction } from "../init-moving/init-moving.action.service";
import { InitPassingAction } from "../init-passing/init-passing.action.service";
import { IsBallInPosition } from "../../../stores/ball-position/ball-position.selector";
import { filter, take } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class PickUpPlayerAction implements ActionStrategy {
    ruleSet: ActionRuleSet;
    availableNextActions: Type<ActionStrategy>[] = []
  
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
      this.availableNextActions.push(InitMovingAction);

      this.store.select(IsBallInPosition(context.coordinates))
      .pipe(
        take(1),
        filter(IsBallInPosition => !!IsBallInPosition)
      )
      .subscribe(() => {
        this.availableNextActions.push(InitPassingAction);
      })
    }
  
    updateState(context: ActionContext): void {
      const pickUpPlayerActionMeta: PickUpPlayerActionMeta = {
        timestamp: new Date(),
        clickedCoordinates: context.coordinates,
        playerCoordinates: context.coordinates,
        playerID: context.player?.id,
        availableNextActions: this.availableNextActions
      }
      this.store.dispatch(saveActionMeta(pickUpPlayerActionMeta));
    }
  }