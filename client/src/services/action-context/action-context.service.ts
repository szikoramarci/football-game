import { Injectable, OnDestroy, Type } from "@angular/core";
import { BaseContext } from "../../action-steps/classes/base-context.interface";
import { forkJoin, map, Observable, Subscription, take } from "rxjs";
import { StepMeta } from "../../action-steps/classes/step-meta.interface";
import { GridService } from "../grid/grid.service";
import { PlayerService } from "../player/player.service";
import { getAttackingTeam } from "../../stores/gameplay/gameplay.selector";
import { Store } from "@ngrx/store";
import { getAvailableActions, getLastStepMeta } from "../../stores/action/action.selector";
import { ActionContext } from "../../action-steps/classes/action-context.interface";
import { Action } from "../../actions/action.interface";

@Injectable({
    providedIn: 'root'
})
export class ActionContextService implements OnDestroy {

    lastStepMeta!: StepMeta | undefined
    availableActions!: Action[]

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

    getLastStepMeta(): Observable<StepMeta | undefined> {
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

    generateActionContext(baseContext: BaseContext): Observable<ActionContext> {
        return forkJoin({            
            player: this.player.getPlayerOnCoordinates(baseContext.coordinates),
            playerHasBall: this.player.playerHasBall(baseContext.coordinates),            
            activeTeam: this.getActiveTeam()
        }).pipe(
            map(({player, playerHasBall, activeTeam }) => {
                return {
                    ...baseContext,
                    player: player,  
                    hex: this.grid.getHex(baseContext.coordinates),
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
