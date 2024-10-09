import { Injectable } from "@angular/core";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { IsOwnPlayer } from "../../../actions/rules/move/is-own-player.rule";
import { Store } from "@ngrx/store";
import { IsPlayerSelected } from "../../../actions/rules/move/is-player-selected.rule";
import { GridService } from "../../grid/grid.service";
import { Grid, Hex, HexCoordinates, Traverser } from "honeycomb-grid";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";
import { IsTheNextAction } from "../../../actions/rules/is-the-next-action.rule";
import { IsPickedPlayerClicked } from "../../../actions/rules/cancel/is-picked-player-clicked.rule";
import { CancelAction } from "../cancel/cancel.service";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { InitPassingActionMeta } from "../../../actions/metas/init-passing.action.meta";
import { HasThePlayerTheBall } from "../../../actions/rules/pass/has-the-player-the-ball.rule";
import { of, switchMap, take } from "rxjs";
import { STANDARD_PASS_HEX_DISTANCE, STANDARD_PASS_PIXEL_DISTANCE } from "../../../constants";
import { selectActiveTeamPlayersWithPositions, selectOppositeTeamPlayersWithPositions } from "../../../stores/gameplay/gameplay.selector";
import { SetPassingPathAction } from "../set-passing-path/set-passing-path.action.service";
import { TraverserService } from "../../traverser/traverser.service";

@Injectable({
  providedIn: 'root',
})
export class InitPassingAction implements ActionStrategy {
    ruleSet: ActionRuleSet;
    availableTargets!: Grid<Hex>;
  
    constructor(
      private store: Store,
      private grid: GridService,
      private traverser: TraverserService
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

    filterOutPlayersByRange(passerPosition: HexCoordinates, targetPosition: HexCoordinates): boolean {
      const distanceInPixels = this.traverser.getHexCenterDistanceInPixelsByCoordinates(passerPosition, targetPosition)
      return distanceInPixels && distanceInPixels < STANDARD_PASS_PIXEL_DISTANCE || false
    }

    getPotentialTargetsOfPass(context: ActionContext) {
      return this.store.select(selectActiveTeamPlayersWithPositions).pipe(    
        take(1),           
        switchMap(players => {
          return of(players
            .filter(player => player.id != context.player?.id) // REMOVING THE PASSER
            .filter(targetPlayer => this.filterOutPlayersByRange(context.coordinates, targetPlayer.position)) // FILTER FOR RANGE
            .map(targetPlayer => targetPlayer.position))
        }),
      )
    }    

    getPossiblyObstacleOppositeTeamPlayers(context: ActionContext) {
      return this.store.select(selectOppositeTeamPlayersWithPositions).pipe(
          take(1),
          switchMap(players => {
          return of(players            
              .filter(targetPlayer => this.filterOutPlayersByRange(context.coordinates, targetPlayer.position)) // FILTER FOR RANGE    
              .map(targetPlayer => targetPlayer.position))
          })
      )
  }
  
    calculation(context: ActionContext): void {  
    /*  this.getPotentialTargetsOfPass(context).subscribe(targetCoordinates => {
        this.availableTargets = this.grid.createGrid().setHexes(targetCoordinates);
      })   */
      /*  this.getPossiblyObstacleOppositeTeamPlayers(context).subscribe(obstacleCoordinates => {
          const fieldOfViewTraverser = this.grid.fieldOfView(context.lastActionMeta?.clickedCoordinates!, obstacleCoordinates);
          this.availableTargets = this.grid.createGrid(fieldOfViewTraverser);      
        })*/

        this.availableTargets = this.traverser.getAreaByDistance(
          context.lastActionMeta?.clickedCoordinates!, 
          STANDARD_PASS_HEX_DISTANCE,
          STANDARD_PASS_PIXEL_DISTANCE
        )
        
    }
  
    updateState(context: ActionContext): void {
      const initPassingActionMeta: InitPassingActionMeta = {     
        actionType: InitPassingAction,   
        timestamp: new Date(),
        clickedCoordinates: context.coordinates,
        playerCoordinates: context.coordinates,
        availableNextActions: [CancelAction, SetPassingPathAction],
        availableTargets: this.availableTargets
      }
      this.store.dispatch(saveActionMeta(initPassingActionMeta));
    }
  }