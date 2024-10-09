import { Injectable, Type } from "@angular/core";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { IsOwnPlayer } from "../../../actions/rules/move/is-own-player.rule";
import { Store } from "@ngrx/store";
import { IsAvailableNextActionsEmpty } from "../../../actions/rules/is-available-next-actions-empty.rule";
import { IsPlayerSelected } from "../../../actions/rules/move/is-player-selected.rule";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { GridService } from "../../grid/grid.service";
import { equals, Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";
import { take } from "rxjs";
import { playerMovementEvents } from "../../../stores/player-position/player-position.selector";
import { InitPassingAction } from "../init-passing/init-passing.action.service";
import { SetMovingPathAction } from "../set-moving-path/set-moving-path.action.service";
import { InitMovingActionMeta } from "../../../actions/metas/init-moving.action.meta";
import { CancelAction } from "../cancel/cancel.service";
import { TraverserService } from "../../traverser/traverser.service";

@Injectable({
  providedIn: 'root',
})
export class InitMovingAction implements ActionStrategy {
    ruleSet: ActionRuleSet;
    reachableHexes!: Grid<Hex>;
    availableNextActions: Type<ActionStrategy>[] = [];
  
    constructor(
      private store: Store,
      private grid: GridService,
      private traverser: TraverserService
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
      this.generateReachableHexes(context);
      this.generateAvailableNextActions(context);      
    }

    generateReachableHexes(context: ActionContext) {
      const centralPoint = context.coordinates;
      const distance = context.player?.speed || 0;      
      this.store.select(playerMovementEvents).pipe(take(1))
        .subscribe((occupiedCoordinates) => {
          const offsetCoordinates: OffsetCoordinates[] = Object.values(occupiedCoordinates)        
          const occupiedHexes = this.grid.createGrid().setHexes(offsetCoordinates).setHexes(this.grid.getFrame());
          this.reachableHexes = this.traverser.getReachableHexes(centralPoint, distance, occupiedHexes)
        })
    }

    generateAvailableNextActions(context: ActionContext) {
      this.availableNextActions = [SetMovingPathAction, CancelAction];
     
      if (context.playerHasBall){
        this.availableNextActions.push(InitPassingAction);
      }
    }
  
    updateState(context: ActionContext): void {
      const initMovingActionMeta: InitMovingActionMeta = {
        actionType: InitMovingAction,
        timestamp: new Date(),
        clickedCoordinates: context.coordinates,
        playerCoordinates: context.coordinates,        
        playerID: context.player?.id,
        playerHasBall: context.playerHasBall,
        reachableHexes: this.reachableHexes,
        availableNextActions: this.availableNextActions
      }
      this.store.dispatch(saveActionMeta(initMovingActionMeta));      
    }
  }