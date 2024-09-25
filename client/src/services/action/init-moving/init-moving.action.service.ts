import { Injectable } from "@angular/core";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { Store } from "@ngrx/store";
import { GridService } from "../../grid/grid.service";
import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { playerMovementEvents } from "../../../stores/player-position/player-position.selector";
import { take } from "rxjs";
import { IsTheNextAction } from "../../../actions/rules/is-the-next-action.rule";

@Injectable({
  providedIn: 'root',
})
export class InitMovingAction implements ActionStrategy {
    ruleSet: ActionRuleSet;
    reachableHexes!: Grid<Hex>;
  
    constructor(
      private store: Store,
      private grid: GridService
    ) {
      this.ruleSet = new ActionRuleSet();
      this.ruleSet.addRule(new IsTheNextAction(InitMovingAction));
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
     /* const initMovingActionMeta: InitMovingActionMeta = {
        timestamp: new Date(),
        playerID: context.player?.id,
        availableNextActions: [SetMovingPathAction, CancelMovingPlayerAction],
        reachableHexes: this.reachableHexes
      }
      this.store.dispatch(saveActionMeta(initMovingActionMeta));*/
    }
  }