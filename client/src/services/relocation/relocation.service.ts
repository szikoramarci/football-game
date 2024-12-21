import { Injectable, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import { RelocationTurn } from "../../relocation/relocation-turn.interface";
import { map, Observable, Subscription } from "rxjs";
import { getRelocationState } from "../../stores/relocation/relocation.selector";
import { PlayerService } from "../player/player.service";
import { getAttackingTeam } from "../../stores/gameplay/gameplay.selector";
import { PlayerWithPosition } from "../../interfaces/player-with-position.interface";
import { Hex } from "honeycomb-grid";
import { GridService } from "../grid/grid.service";

@Injectable({
    providedIn: 'root'
})
export class RelocationService implements OnDestroy {

    attackingTeam!: string
    playersWithPosition!: PlayerWithPosition[]

    relocationTurns: RelocationTurn[] = []
    usedPlayers: Set<string> = new Set()    

    attackingTeamSubscription!: Subscription
    currentScenarioSubscription!: Subscription

    movementPhase: RelocationTurn[] = [
        {
            team: 'barca',
            movementType: 'steps',
            movementLimit: 'ownSpeed',
        },
        {
            team: 'barca',
            movementType: 'steps',
            movementLimit: 'ownSpeed',
        },
        {
            team: 'real',
            movementType: 'steps',
            movementLimit: 'ownSpeed',
        },
        {
            team: 'real',
            movementType: 'steps',
            movementLimit: 'ownSpeed',
        },
        {
            team: 'barca',
            movementType: 'steps',
            movementLimit: 2,
        }
    ]

    constructor(
        private store: Store,
        private player: PlayerService,
        private grid: GridService
    ){
        this.initSubscriptions()
    }

    initSubscriptions() {
        this.attackingTeamSubscription = this.store.select(getAttackingTeam()).subscribe(attackingTeam => {
            this.attackingTeam = attackingTeam
        })
        this.currentScenarioSubscription = this.store.select(getRelocationState).subscribe(currentScenario => {
            this.relocationTurns = currentScenario.relocationTurns
            this.usedPlayers = currentScenario.usedPlayers
        })
    }

    isRelocationScenarioActive(): boolean {
        return this.relocationTurns.length > 0
    }

    getSelectablePlayersIds(): Observable<Set<string>> {
        return this.getSelectablePlayersWithPosition().pipe(
            map(playersWithPosition => {
                return new Set<string>(playersWithPosition.map(playerWithPosition => playerWithPosition.player.id))
            })
        )
    }

    getSelectableHexes(): Observable<Hex[]> {
        return this.getSelectablePlayersWithPosition().pipe(
            map(playersWithPosition => {
                return playersWithPosition.map(playerWithPosition => this.grid.getHex(playerWithPosition.position)!)
            })
        )
    }

    getSelectablePlayersWithPosition(): Observable<PlayerWithPosition[]> {
        return this.player.getPlayersWithPositions().pipe(
            map(playersWithPosition => {
                return playersWithPosition.filter(playerWithPosition => {               
                    if (playerWithPosition.player == undefined) return false

                    if (this.relocationTurns.length == 0) {
                        return playerWithPosition.player.team == this.attackingTeam
                    } 

                    if (this.usedPlayers.has(playerWithPosition.player.id)) return false 

                    const currentRelocationTurn = this.relocationTurns[0]
                    if (currentRelocationTurn.team != playerWithPosition.player.team) return false

                    return true
                })
            })
        )
    }

    generateMovementPhase() {
        return this.movementPhase
    } 
    
    ngOnDestroy(): void {
        this.attackingTeamSubscription.unsubscribe()
        this.currentScenarioSubscription.unsubscribe()
    }
}