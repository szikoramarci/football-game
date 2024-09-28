import { Injectable } from "@angular/core";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { IsOwnPlayer } from "../../../actions/rules/init-moving/is-own-player.rule";
import { Store } from "@ngrx/store";
import { IsPlayerSelected } from "../../../actions/rules/init-moving/is-player-selected.rule";
import { GridService } from "../../grid/grid.service";
import { distance, equals, Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";
import { IsTheNextAction } from "../../../actions/rules/is-the-next-action.rule";
import { IsPickedPlayerClicked } from "../../../actions/rules/cancel/is-picked-player-clicked.rule";
import { CancelAction } from "../cancel/cancel.service";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { InitPassingActionMeta } from "../../../actions/metas/init-passing.action.meta";
import { HasThePlayerTheBall } from "../../../actions/rules/init-passing/has-the-player-the-ball.rule";
import { playerMovementEvents } from "../../../stores/player-position/player-position.selector";
import { filter, take } from "rxjs";
import { STANDARD_PASS_PIXEL_DISTANCE } from "../../../constants";

@Injectable({
  providedIn: 'root',
})
export class InitPassingAction implements ActionStrategy {
    ruleSet: ActionRuleSet;
    availableTargets!: Grid<Hex>;
  
    constructor(
      private store: Store,
      private grid: GridService
    ) {
      this.ruleSet = new ActionRuleSet();
      this.ruleSet.addRule(new IsLeftClick());
      this.ruleSet.addRule(new IsTheNextAction(InitPassingAction));    
      this.ruleSet.addRule(new IsPickedPlayerClicked());
      this.ruleSet.addRule(new IsPlayerSelected());
      this.ruleSet.addRule(new HasThePlayerTheBall());
      this.ruleSet.addRule(new IsOwnPlayer());
    }
  
    identify(context: ActionContext): boolean {
      return this.ruleSet.validate(context);
    }
  
    calculation(context: ActionContext): void {
      const passingDistance = 3;      
      this.store.select(playerMovementEvents).pipe(
          take(1),        
        )        
        .subscribe((occupiedCoordinates) => {          
          const offsetCoordinates: OffsetCoordinates[] =
          Object.values(occupiedCoordinates)                            
            .filter(coordinate => !equals(coordinate, context.coordinates)) // REMOVE THE PASSER
            .filter(coordinate => {
              const distanceInPixels = this.grid.getDistanceInPixels(coordinate, context.coordinates)
              return distanceInPixels && distanceInPixels < STANDARD_PASS_PIXEL_DISTANCE
            });
          this.availableTargets = this.grid.createGrid().setHexes(offsetCoordinates);        
      })
    }
  
    updateState(context: ActionContext): void {
      const initPassingActionMeta: InitPassingActionMeta = {     
        actionType: InitPassingAction,   
        timestamp: new Date(),
        clickedCoordinates: context.coordinates,
        playerCoordinates: context.coordinates,
        availableNextActions: [CancelAction],
        availableTargets: this.availableTargets
      }
      this.store.dispatch(saveActionMeta(initPassingActionMeta));
    }
  }