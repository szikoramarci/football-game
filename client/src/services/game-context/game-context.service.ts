import { Injectable, OnDestroy, Type } from "@angular/core";
import { BaseContext } from "../../actions/classes/base-context.interface";
import { forkJoin, map, Observable, Subscription, take } from "rxjs";
import { ActionMeta } from "../../actions/classes/action-meta.interface";
import { GridService } from "../grid/grid.service";
import { PlayerService } from "../player/player.service";
import { getAttackingTeam } from "../../stores/gameplay/gameplay.selector";
import { Store } from "@ngrx/store";
import { getAvailableActions, getLastStepMeta } from "../../stores/action/action.selector";
import { GameContext } from "../../actions/classes/game-context.interface";
import { Action } from "../../actions/classes/action.class";

@Injectable({
    providedIn: 'root'
})
export class GameContextService implements OnDestroy {

    lastStepMeta!: ActionMeta | undefined
    availableActions!: Type<Action>[]
    currentAction!: Type<Action>

    lastStepMetaSubscription!: Subscription
    availableActionsSubscription!: Subscription

    constructor(
        private grid: GridService,
        private store: Store,
        private player: PlayerService
    ){
        this.initSubscriptions()
    }

    initSubscriptions() {
        this.lastStepMetaSubscription = this.store.select(getLastStepMeta()).subscribe(lastStepMeta => {
            this.lastStepMeta = lastStepMeta
        })
        this.availableActionsSubscription = this.store.select(getAvailableActions()).subscribe(availableActions => {
            this.availableActions = availableActions
        })
    }

    getLastStepMeta(): Observable<ActionMeta | undefined> {
        return this.store.select(getLastStepMeta())
            .pipe(
                take(1)
            )
    }

    getActiveTeam(): Observable<string> {
        return this.store.select(getAttackingTeam())
            .pipe(
                take(1)
            )
    }

    generateGameContext(baseContext: BaseContext): Observable<GameContext> {
        return forkJoin({            
            player: this.player.getPlayerOnCoordinates(baseContext.hex),
            playerHasBall: this.player.playerHasBall(baseContext.hex),            
            activeTeam: this.getActiveTeam()
        }).pipe(
            map(({player, playerHasBall, activeTeam }) => {
                return {
                    ...baseContext,
                    player: player,  
                    playerHasBall: playerHasBall,
                    lastStepMeta: this.lastStepMeta,
                    availableActions: this.availableActions,
                    activeTeam: activeTeam
                }
            })
        )
    }

    ngOnDestroy(): void {
        this.lastStepMetaSubscription.unsubscribe()
        this.availableActionsSubscription.unsubscribe()
    }

}
