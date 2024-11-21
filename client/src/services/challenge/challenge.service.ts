import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectDefendingTeamPlayersWithPositions } from "../../stores/gameplay/gameplay.selector";
import { delay, filter, from, map, Observable, scan, skip, switchMap, take } from "rxjs";
import { Hex } from "honeycomb-grid";
import { TraverserService } from "../traverser/traverser.service";
import { PlayerWithPosition } from "../../interfaces/player-with-position.interface";
import { HexRelatedPlayers } from "../../interfaces/hex-related-players.interface";
import { getPlayer } from "../../stores/player/player.selector";
import { setAttackingTeam } from "../../stores/gameplay/gameplay.actions";
import { moveBall } from "../../stores/ball-position/ball-position.actions";
import { getPlayerPosition } from "../../stores/player-position/player-position.selector";

@Injectable({
    providedIn: 'root'
})
export class ChallengeService {

    constructor(
        private store: Store,
        private traverser: TraverserService
    ) {}

    dribbleTackleChallenge(): boolean {
        return this.rollDice() == 6
    }

    rollDice(): number {
        const diceValue = Math.floor(Math.random() * 6) + 1;
        console.log(diceValue)
        return diceValue
    }

    generateChallengeHexes(pathHexes: Hex[], skipHex: number = 0): Observable<Map<string,Hex>> {
        return this.store.select(selectDefendingTeamPlayersWithPositions).pipe(
            take(1),
            switchMap(oppositionPlayers =>
                from(pathHexes)                
                .pipe(
                    skip(skipHex),
                    map(hex => this.getHexWithOppositionPlayers(hex, oppositionPlayers)),
                    filter(({ players }) => players.length > 0),
                    scan(this.updateChallengeHexes.bind(this), { challengeHexes: new Map<string, Hex>() }),                   
                    map(({ challengeHexes }) => challengeHexes)
                )            
            )
        )  
    }

    private getHexWithOppositionPlayers(hex: Hex, oppositionPlayers: PlayerWithPosition[]): HexRelatedPlayers {
        const neighborHexes = this.traverser.getNeighbors(hex);
        const players  = oppositionPlayers
            .filter(({ position }) => neighborHexes.getHex(position))
            .map(({ player }) => player)

        return { hex, players }
    }

    private updateChallengeHexes(acc: { challengeHexes: Map<string,Hex> }, { hex, players }: HexRelatedPlayers) {
        players.forEach(player => {            
            if (!acc.challengeHexes.has(player.id)) {
                acc.challengeHexes.set(player.id, hex)
            }
        });
        return acc;
    }

    transferBallToOpponent(oppositionPlayerID: string, delayTime: number = 0) {
        this.store.select(getPlayerPosition(oppositionPlayerID))
            .pipe(
                take(1),
                delay(delayTime)
            )
            .subscribe(playerPosition => {
                this.store.dispatch(moveBall(playerPosition))
            })        
    }   

    switchActiveTeam(oppositionPlayerID: string) {
        this.store.select(getPlayer(oppositionPlayerID))
            .pipe(
                take(1)
            )
            .subscribe(player => {
                this.store.dispatch(setAttackingTeam({ attackingTeam: player.team }))
            })
    }
}