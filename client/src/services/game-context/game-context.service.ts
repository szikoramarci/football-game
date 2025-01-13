import { Injectable, OnDestroy, Type } from "@angular/core";
import { BaseContext } from "../../actions/classes/base-context.interface";
import { forkJoin, map, Observable, Subscription, take } from "rxjs";
import { ActionMeta } from "../../actions/classes/action-meta.interface";
import { PlayerService } from "../player/player.service";
import { getAttackingTeam } from "../../stores/gameplay/gameplay.selector";
import { Store } from "@ngrx/store";
import { getCurrentActionMeta, getLastEvent } from "../../stores/action/action.selector";
import { GameContext } from "../../actions/classes/game-context.interface";
import { Action } from "../../actions/classes/action.class";
import { RelocationService } from "../relocation/relocation.service";
import { TacklingHelperService } from "../action-helper/tackling-helper.service";
import { ActionService } from "../action/action.service";
import { Event } from "../../enums/event.enum";

@Injectable({
    providedIn: 'root'
})
export class GameContextService implements OnDestroy {
    
    lastEvent!: Event | undefined 
    currentAction!: Type<Action>
    currentActionMeta!: ActionMeta | undefined    
    selectablePlayers!: Set<string>

    currentActionMetaSubscription!: Subscription
    lastEventSubscription!: Subscription    
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
        this.lastEventSubscription = this.store.select(getLastEvent()).subscribe(lastEvent => {
            this.lastEvent = lastEvent
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
                    availableActions: this.action.getAvailableActions(this.lastEvent),
                    selectablePlayers: this.selectablePlayers,
                    playerIsMovable: this.relocation.isPlayerMovable(player!),
                    playerIsRelocatable: this.relocation.isPlayerRelocatable(player!),
                    playerCanTackle: this.tacklingHelper.canPlayerTackle(player!)
                }
            })
        )
    }

    ngOnDestroy(): void {
        this.currentActionMetaSubscription.unsubscribe()
        this.lastEventSubscription.unsubscribe()
    }

}
