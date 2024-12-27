import { Injectable, OnDestroy, Type } from "@angular/core";
import { BaseContext } from "../../actions/classes/base-context.interface";
import { forkJoin, map, Observable, Subscription, take } from "rxjs";
import { ActionMeta } from "../../actions/classes/action-meta.interface";
import { PlayerService } from "../player/player.service";
import { getAttackingTeam } from "../../stores/gameplay/gameplay.selector";
import { Store } from "@ngrx/store";
import { getAvailableActions, getCurrentActionMeta } from "../../stores/action/action.selector";
import { GameContext } from "../../actions/classes/game-context.interface";
import { Action } from "../../actions/classes/action.class";
import { RelocationService } from "../relocation/relocation.service";
import { TacklingHelperService } from "../action-helper/tackling-helper.service";
import { ActionService } from "../action/action.service";

@Injectable({
    providedIn: 'root'
})
export class GameContextService implements OnDestroy {
    
    availableActions!: Type<Action>[]
    currentAction!: Type<Action>
    currentActionMeta!: ActionMeta | undefined    
    selectablePlayers!: Set<string>

    currentActionMetaSubscription!: Subscription
    availableActionsSubscription!: Subscription    
    selectablePlayersSubscription!: Subscription 

    constructor(
        private tacklingHelper: TacklingHelperService,
        private store: Store,
        private player: PlayerService,
        private relocation: RelocationService,
        private action: ActionService
    ){
        this.initSubscriptions()
    }

    initSubscriptions() {
        this.currentActionMetaSubscription = this.store.select(getCurrentActionMeta()).subscribe(currentActionMeta => {
            this.currentActionMeta = currentActionMeta
        })
        this.availableActionsSubscription = this.store.select(getAvailableActions()).subscribe(availableActions => {
            this.availableActions = availableActions
        })
        this.selectablePlayersSubscription = this.action.getSelectablePlayersIds().subscribe(selectablePlayers => {
            this.selectablePlayers = selectablePlayers
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
                    selectablePlayers: this.selectablePlayers,
                    playerIsMovable: this.relocation.isPlayerMovable(player!),
                    playerCanTackle: this.tacklingHelper.canPlayerTackle(player!)
                }
            })
        )
    }

    ngOnDestroy(): void {
        this.currentActionMetaSubscription.unsubscribe()
        this.availableActionsSubscription.unsubscribe()
    }

}
