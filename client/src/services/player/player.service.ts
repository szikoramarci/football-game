import { Store } from "@ngrx/store";
import { equals, Grid, Hex, HexCoordinates, OffsetCoordinates } from "@szikoramarci/honeycomb-grid";
import { Player } from "../../models/player.model";
import { getPlayerByPosition, getPlayerPositions } from "../../stores/player-position/player-position.selector";
import { combineLatest, map, Observable, of, switchMap, take } from "rxjs";
import { getAllPlayers, getPlayer } from "../../stores/player/player.selector";
import { getBallPosition, IsBallInPosition } from "../../stores/ball-position/ball-position.selector";
import { Injectable } from "@angular/core";
import { getGameplay } from "../../stores/gameplay/gameplay.selector";
import { PlayerWithPosition } from "../../interfaces/player-with-position.interface";
import { getOppositeTeam } from "../../models/team.enum";
import { TraverserService } from "../traverser/traverser.service";
import { GridService } from "../grid/grid.service";

@Injectable({
    providedIn: 'root'
})
export class PlayerService {

    constructor(
        private store: Store,
        private traverser: TraverserService,
        private grid: GridService
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

    getPlayerWithBall(): Observable<PlayerWithPosition | undefined> {
        return combineLatest([
            this.store.select(getPlayerPositions),
            this.store.select(getBallPosition()),
            this.store.select(getAllPlayers),
        ]).pipe(
            map(([playerPositions, ballPosition, players]) => {
                const playerWithBallID = (Object.keys(playerPositions).find(playerID => equals(playerPositions[playerID], ballPosition)))

                if (playerWithBallID) {
                    const player = Object.values(players).find(player => player.id === playerWithBallID)
                    return {
                        player: player!,
                        position: playerPositions[playerWithBallID]
                    }
                }
                    
                return undefined
            })   
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
                const teamForSearch = isAttackingTeam ? gameplayState.attackingTeam : getOppositeTeam(gameplayState.attackingTeam);
    
                const teamPlayers = Object.values(players).filter(player => player.team === teamForSearch);
        
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

    getFreeAdjacentHexesByPlayerID(playerID: string): Observable<Grid<Hex>> {
        return this.getPlayersWithPositions().pipe(
            take(1),
            map(playersWithPosition => {
                const playerPosition = playersWithPosition.find(playerWithPosition => playerWithPosition.player.id == playerID)?.position
                return this.getFreeAdjacentHexes(playersWithPosition, playerPosition!)
            })
        )
    }

    getFreeAdjacentHexesByHex(hex: Hex): Observable<Grid<Hex>> {
        return this.getPlayersWithPositions().pipe(
            take(1),
            map(playersWithPosition => this.getFreeAdjacentHexes(playersWithPosition, hex))
        )
    }

    getFreeAdjacentHexes(playersWithPosition: PlayerWithPosition[], position: HexCoordinates): Grid<Hex> {
        return this.traverser.getNeighbors(position).filter(hex => {
            return !playersWithPosition.some(playerWithPosition => equals(playerWithPosition.position, hex))
        })
    }

}