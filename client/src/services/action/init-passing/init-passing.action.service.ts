import { Injectable } from "@angular/core";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { IsOwnPlayer } from "../../../actions/rules/init-moving/is-own-player.rule";
import { Store } from "@ngrx/store";
import { IsPlayerSelected } from "../../../actions/rules/init-moving/is-player-selected.rule";
import { GridService } from "../../grid/grid.service";
import { Grid, Hex, HexCoordinates } from "honeycomb-grid";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";
import { IsTheNextAction } from "../../../actions/rules/is-the-next-action.rule";
import { IsPickedPlayerClicked } from "../../../actions/rules/cancel/is-picked-player-clicked.rule";
import { CancelAction } from "../cancel/cancel.service";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { InitPassingActionMeta } from "../../../actions/metas/init-passing.action.meta";
import { HasThePlayerTheBall } from "../../../actions/rules/init-passing/has-the-player-the-ball.rule";
import { filter, forkJoin, of, switchMap, take } from "rxjs";
import { STANDARD_PASS_PIXEL_DISTANCE } from "../../../constants";
import { selectActiveTeamPlayersWithPositions, selectOppositeTeamPlayersWithPositions } from "../../../stores/gameplay/gameplay.selector";
import { SetPassingPathAction } from "../set-passing-path/set-passing-path.action.service";

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

    filterOutPlayersByRange(passerPosition: HexCoordinates, targetPosition: HexCoordinates): boolean {
      const distanceInPixels = this.grid.getDistanceInPixels(passerPosition, targetPosition)
      return distanceInPixels && distanceInPixels < STANDARD_PASS_PIXEL_DISTANCE || false
    }

    generateDirectLinePathForTarget(passerPosition: HexCoordinates, targetPosition: HexCoordinates) {
      return {
        targetCoordinate: targetPosition,
        directLine: this.grid.getDirectLine(passerPosition, targetPosition)
      }
    }

    getPotentialTargetsOfPass(context: ActionContext) {
      return this.store.select(selectActiveTeamPlayersWithPositions).pipe(    
        take(1),           
        switchMap(players => {
          return of(players
            .filter(player => player.id != context.player?.id) // REMOVING THE PASSER
            .filter(targetPlayer => this.filterOutPlayersByRange(context.coordinates, targetPlayer.position)) // FILTER FOR RANGE
            .map(targetPlayer => this.generateDirectLinePathForTarget(context.coordinates, targetPlayer.position)))
        }),
      )
    }

    getPossiblyObstacleOppositeTeamPlayers(context: ActionContext) {
      return this.store.select(selectOppositeTeamPlayersWithPositions).pipe(
        take(1),
        switchMap(players => {
          return of(players            
            .filter(targetPlayer => this.filterOutPlayersByRange(context.coordinates, targetPlayer.position))) // FILTER FOR RANGE    
        })
      )
    }
  
    calculation(context: ActionContext): void {  
      forkJoin([
        this.getPotentialTargetsOfPass(context),
        this.getPossiblyObstacleOppositeTeamPlayers(context)
      ]).subscribe(([potentialTargets, oppositionTeamPlayers]) => {
        const targetCoordinates = potentialTargets
          .filter(potenitalTarget => {
            return oppositionTeamPlayers.every(oppositionTeamPlayer => !potenitalTarget.directLine.getHex(oppositionTeamPlayer.position))
          })
          .map(potentialTargets => potentialTargets.targetCoordinate)

        this.availableTargets = this.grid.createGrid().setHexes(targetCoordinates);
      })
             
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