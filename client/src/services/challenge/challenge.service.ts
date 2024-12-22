import { Injectable, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import { delay, Subscription, take } from "rxjs";
import { Hex } from "honeycomb-grid";
import { TraverserService } from "../traverser/traverser.service";
import { PlayerWithPosition } from "../../interfaces/player-with-position.interface";
import { HexRelatedPlayers } from "../../interfaces/hex-related-players.interface";
import { getPlayer } from "../../stores/player/player.selector";
import { setAttackingTeam } from "../../stores/gameplay/gameplay.actions";
import { moveBall } from "../../stores/ball-position/ball-position.actions";
import { getPlayerPosition } from "../../stores/player-position/player-position.selector";
import { PlayerService } from "../player/player.service";

@Injectable({
    providedIn: 'root'
})
export class ChallengeService implements  OnDestroy {

    defensiveTeamPlayersWithPositions: PlayerWithPosition[] = []

    defensiveTeamPlayersWithPositionsSubscriptions!: Subscription

    constructor(
        private store: Store,
        private traverser: TraverserService,
        private player: PlayerService
    ) {
        this.initSubscriptions()
    }

    initSubscriptions() {
        this.defensiveTeamPlayersWithPositionsSubscriptions = this.player.getDefendingPlayersWithPositions().subscribe(defensiveTeamPlayersWithPositions => {
            this.defensiveTeamPlayersWithPositions = defensiveTeamPlayersWithPositions
        })
    }

    dribbleTackleChallenge(): boolean {
        return this.rollDice() == 6
    }

    rollDice(): number {
        const diceValue = Math.floor(Math.random() * 6) + 1;
        console.log(diceValue)
        return diceValue
    }

    generateChallengeHexes(pathHexes: Hex[], skipHex: number = 0): Map<string,Hex> {
        return pathHexes
            .slice(skipHex)
            .map(hex => this.getHexWithOppositionPlayers(hex, this.defensiveTeamPlayersWithPositions))
            .filter(({ players }) => players.length > 0)
            .reduce(
                this.updateChallengeHexes.bind(this), 
                new Map<string, Hex>()
            ) 
    }

    private getHexWithOppositionPlayers(hex: Hex, oppositionPlayers: PlayerWithPosition[]): HexRelatedPlayers {
        const neighborHexes = this.traverser.getNeighbors(hex);
        const players  = oppositionPlayers
            .filter(({ position }) => neighborHexes.getHex(position))
            .map(({ player }) => player)

        return { hex, players }
    }

    private updateChallengeHexes(challengeHexes: Map<string, Hex>, { hex, players }: HexRelatedPlayers): Map<string, Hex> {
        players.forEach(player => {
            if (!challengeHexes.has(player.id)) {
                challengeHexes.set(player.id, hex);
            }
        });
        return challengeHexes;
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

    ngOnDestroy(): void {
        this.defensiveTeamPlayersWithPositionsSubscriptions.unsubscribe()
    }
}