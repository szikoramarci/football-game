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
import { getPositionsByPlayerIDs, playerMovementEvents } from "../../../stores/player-position/player-position.selector";
import { filter, map, Observable, of, switchMap, take } from "rxjs";
import { STANDARD_PASS_PIXEL_DISTANCE } from "../../../constants";
import { getActiveTeam } from "../../../stores/gameplay/gameplay.selector";
import { getPlayersFromOppositeTeam, getPlayersFromTeam } from "../../../stores/player/player.selector";
import { Player } from "../../../models/player.model";

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

    getActiveTeam(): Observable<string> {
      return this.store.select(getActiveTeam()).pipe(take(1));
    }

    getPlayersFromActiveTeam(): Observable<Player[]> {
      return this.getActiveTeam().pipe(switchMap(team => this.store.select(getPlayersFromTeam(team)).pipe(take(1))))
    }

    getPlayersFromOppositeTeam(): Observable<Player[]> {
      return this.getActiveTeam().pipe(switchMap(team => this.store.select(getPlayersFromOppositeTeam(team)).pipe(take(1))))
    }

    getPositionsOfPlayers(playerIDs: string[]) {
      return this.store.select(getPositionsByPlayerIDs(playerIDs)).pipe(take(1))
    }

    getPositionsOfActiveTeamPlayersWithoutSelectedPlayer(selectedPlayerId: string) {
      return this.getPlayersFromActiveTeam().pipe(switchMap(players => {
        const playerIDs = players
            .map(player => player.id)
            .filter(playerID => playerID != selectedPlayerId) // REMOVE PASSER
        return this.getPositionsOfPlayers(playerIDs);
      }))
    }

    getPositionsOfOppositeTeamPlayers() {
      return this.getPlayersFromOppositeTeam().pipe(switchMap(players => {
        const playerIDs = players.map(player => player.id)        
        return this.getPositionsOfPlayers(playerIDs);
      }))
    }
  
    calculation(context: ActionContext): void {  
      const selectedPlayerId: string = context.player?.id || "none";
      this.getPositionsOfActiveTeamPlayersWithoutSelectedPlayer(selectedPlayerId).pipe(       
        switchMap(teamMateCoordinates => {
          return of(Object.values(teamMateCoordinates)                                       
            .filter(coordinate => {
              const distanceInPixels = this.grid.getDistanceInPixels(coordinate, context.coordinates)
              return distanceInPixels && distanceInPixels < STANDARD_PASS_PIXEL_DISTANCE
            })
            .map(coordinate => {
              return {
                targetCoordinate: coordinate,
                directLine: this.grid.getDirectLine(coordinate, context.coordinates)
              }
            }))       
        }),
        switchMap(possibleTargets => {
          return this.getPositionsOfOppositeTeamPlayers().pipe(
            switchMap(playerPositions => {
              return of(possibleTargets
                .filter(({ targetCoordinate, directLine }) => {                  
                  let valid = true;
                  Object.values(playerPositions).forEach(playerPosition => {
                    if (directLine.getHex(playerPosition)) {
                      valid = false;
                      return
                    }
                  })                  

                  return valid;
                })
                .map(({ targetCoordinate }) => targetCoordinate))         
            })
          )         
        })
      ).subscribe(targetCoordinates => {
        this.availableTargets = this.grid.createGrid().setHexes(targetCoordinates);
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