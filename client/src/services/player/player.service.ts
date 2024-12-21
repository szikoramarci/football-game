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
        return this.getPlayersWithPositionsByTeam(true)
    }

    getDefendingPlayersWithPositions(): Observable<PlayerWithPosition[]> {
        return this.getPlayersWithPositionsByTeam(false)
    }

    getPlayersWithPositionsByTeam(isAttackingTeam: boolean): Observable<PlayerWithPosition[]> {
        return combineLatest([
            this.store.select(getPlayerPositions),
            this.store.select(getAllPlayers),
            this.store.select(getGameplay)
        ]).pipe(
            map(([playerPositions, players, gameplayState]) => {            
                const attackingTeam = gameplayState.attackingTeam;
    
                const teamPlayers = Object.values(players).filter(player => isAttackingTeam ? player.team === attackingTeam : player.team !== attackingTeam);
        
                return teamPlayers.map(player => ({
                    player: player,
                    position: playerPositions[player.id] 
                }));
            }))                    
    }

    getPlayersWithPositions(): Observable<PlayerWithPosition[]> {
        return combineLatest([
            this.store.select(getPlayerPositions),
            this.store.select(getAllPlayers)
        ]).pipe(
            map(([playerPositions, players]) => Object.values(players)
                .map(player => ({
                    player: player,
                    position: playerPositions[player.id] 
                }))
            ))                    
    }

}