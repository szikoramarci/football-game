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

@Injectable({
    providedIn: 'root'
})
export class GameContextService implements OnDestroy {
    
    availableActions!: Type<Action>[]
    currentAction!: Type<Action>
    currentActionMeta!: ActionMeta | undefined

    currentActionMetaSubscription!: Subscription
    availableActionsSubscription!: Subscription

    constructor(
        private grid: GridService,
        private store: Store,
        private player: PlayerService
    ){
        this.initSubscriptions()
    }

    initSubscriptions() {
        this.currentActionMetaSubscription = this.store.select(getCurrentActionMeta()).subscribe(lastStepMeta => {
            this.currentActionMeta = lastStepMeta
        })
        this.availableActionsSubscription = this.store.select(getAvailableActions()).subscribe(availableActions => {
            this.availableActions = availableActions
        })
    }

    getLastStepMeta(): Observable<ActionMeta | undefined> {
        return this.store.select(getCurrentActionMeta())
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
                    actionMeta: this.currentActionMeta,
                    availableActions: this.availableActions,
                    activeTeam: activeTeam
                }
            })
        )
    }

    ngOnDestroy(): void {
        this.currentActionMetaSubscription.unsubscribe()
        this.availableActionsSubscription.unsubscribe()
    }

}
