import { Store } from "@ngrx/store";
import { OffsetCoordinates } from "honeycomb-grid";
import { Player } from "../../models/player.model";
import { getPlayerByPosition, getPlayerPositions } from "../../stores/player-position/player-position.selector";
import { combineLatest, map, Observable, of, switchMap, take } from "rxjs";
import { getAllPlayers, getPlayer } from "../../stores/player/player.selector";
import { IsBallInPosition } from "../../stores/ball-position/ball-position.selector";
import { Injectable } from "@angular/core";
import { getGameplay } from "../../stores/gameplay/gameplay.selector";
import { PlayerWithPosition } from "../../interfaces/player-with-position.interface";
import { ActionContext } from "../../action-steps/classes/action-context.interface";
import { MouseTriggerEventType } from "../mouse-event/mouse-event.interface";

@Injectable({
    providedIn: 'root'
})
export class PlayerService {

    constructor(
        private store: Store
    ) {}
    
    getPlayerOnCoordinates(coordinates: OffsetCoordinates): Observable<Player | undefined> {
        return this.store.select(getPlayerByPosition(coordinates))
            .pipe(  
                take(1),    
                switchMap(playerId => {
                    return playerId ? this.store.select(getPlayer(playerId)) : of(undefined);        
                }),
                take(1)
            )
    }

    playerHasBall(coordinates: OffsetCoordinates): Observable<boolean> {
        return this.store.select(IsBallInPosition(coordinates))
            .pipe(                
                take(1),
                map(IsBallInPosition => !!IsBallInPosition)    
            )
    }

    getAttackingPlayersWithPositions(): Observable<PlayerWithPosition[]> {
        return this.getPlayersWithPositions(true)
    }

    getDefendingPlayersWithPositions(): Observable<PlayerWithPosition[]> {
        return this.getPlayersWithPositions(false)
    }

    getPlayersWithPositions(isAttackingTeam: boolean): Observable<PlayerWithPosition[]> {
        return combineLatest([
            this.store.select(getPlayerPositions),
            this.store.select(getAllPlayers),
            this.store.select(getGameplay)
        ]).pipe(
            map(([playerPositions, players, gameplayState]) => {            
                const attackingTeam = gameplayState.attackingTeam;
    
                const attackingTeamPlayers = Object.values(players).filter(player => isAttackingTeam ? player.team === attackingTeam : player.team !== attackingTeam);
        
                return attackingTeamPlayers.map(player => ({
                    player: player,
                    position: playerPositions[player.id] 
                }));
            }))                    
    }

    isSelectableForAction(actionContext: ActionContext) {
        if (actionContext.mouseEventType !== MouseTriggerEventType.LEFT_CLICK) return false
        
        return actionContext.player?.team == actionContext.activeTeam || false
    }

}