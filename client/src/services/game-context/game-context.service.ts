import { Injectable, OnDestroy, Type } from "@angular/core";
import { BaseContext } from "../../actions/classes/base-context.interface";
import { forkJoin, map, Observable, Subscription, take } from "rxjs";
import { ActionMeta } from "../../actions/classes/action-meta.interface";
import { GridService } from "../grid/grid.service";
import { PlayerService } from "../player/player.service";
import { getAttackingTeam } from "../../stores/gameplay/gameplay.selector";
import { Store } from "@ngrx/store";
import { getAvailableActions, getCurrentActionMeta } from "../../stores/action/action.selector";
import { GameContext } from "../../actions/classes/game-context.interface";
import { Action } from "../../actions/classes/action.class";
import { getRelocationState } from "../../stores/relocation/relocation.selector";
import { RelocationTurn } from "../../relocation/relocation-turn.interface";

@Injectable({
    providedIn: 'root'
})
export class GameContextService implements OnDestroy {
    
    attackingTeam!: string
    availableActions!: Type<Action>[]
    currentAction!: Type<Action>
    currentActionMeta!: ActionMeta | undefined
    relocationTurns: RelocationTurn[] = []
    usedPlayers: Set<string> = new Set()

    attackingTeamSubscription!: Subscription
    currentActionMetaSubscription!: Subscription
    availableActionsSubscription!: Subscription
    curentScenarioSubscription!: Subscription

    constructor(
        private grid: GridService,
        private store: Store,
        private player: PlayerService
    ){
        this.initSubscriptions()
    }

    initSubscriptions() {
        this.attackingTeamSubscription = this.store.select(getAttackingTeam()).subscribe(attackingTeam => {
            this.attackingTeam = attackingTeam
        })
        this.currentActionMetaSubscription = this.store.select(getCurrentActionMeta()).subscribe(currentActionMeta => {
            this.currentActionMeta = currentActionMeta
        })
        this.availableActionsSubscription = this.store.select(getAvailableActions()).subscribe(availableActions => {
            this.availableActions = availableActions
        })
        this.curentScenarioSubscription = this.store.select(getRelocationState).subscribe(currentScenario => {
            console.log(currentScenario)
            this.relocationTurns = currentScenario.relocationTurns
            this.usedPlayers = currentScenario.usedPlayers
        })
    }

    getAttackingTeam(): Observable<string> {
        return this.store.select(getAttackingTeam())
            .pipe(
                take(1)
            )
    }

    generateGameContext(baseContext: BaseContext): Observable<GameContext> {
        return forkJoin({            
            player: this.player.getPlayerOnCoordinates(baseContext.hex),
            playerHasBall: this.player.playerHasBall(baseContext.hex)
        }).pipe(
            map(({player, playerHasBall }) => {
                return {
                    ...baseContext,
                    player: player,  
                    playerHasBall: playerHasBall,
                    actionMeta: this.currentActionMeta,
                    availableActions: this.availableActions,
                    attackingTeam: this.attackingTeam,
                    relocationTurns: this.relocationTurns,
                    usedPlayers: this.usedPlayers
                }
            })
        )
    }

    ngOnDestroy(): void {
        this.attackingTeamSubscription.unsubscribe()
        this.currentActionMetaSubscription.unsubscribe()
        this.availableActionsSubscription.unsubscribe()
        this.curentScenarioSubscription.unsubscribe()
    }

}
