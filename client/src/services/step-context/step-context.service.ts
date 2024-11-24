import { Injectable } from "@angular/core";
import { Hex } from "honeycomb-grid";
import { BaseContext } from "../../action-steps/classes/base-context.interface";
import { forkJoin, map, Observable, switchMap, take } from "rxjs";
import { Player } from "../../models/player.model";
import { StepMeta } from "../../action-steps/classes/step-meta.interface";
import { GridService } from "../grid/grid.service";
import { PlayerService } from "../player/player.service";
import { getAttackingTeam } from "../../stores/gameplay/gameplay.selector";
import { Store } from "@ngrx/store";
import { getLastStepMeta } from "../../stores/action/action.selector";
import { StepContext } from "../../action-steps/classes/step-context.interface";

@Injectable({
    providedIn: 'root'
})
export class StepContextService {

    constructor(
        private grid: GridService,
        private store: Store,
        private player: PlayerService
    ){}

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

    generateStepContext(baseContext: BaseContext): Observable<StepContext> {
        return forkJoin({            
            player: this.player.getPlayerOnCoordinates(baseContext.coordinates),
            playerHasBall: this.player.playerHasBall(baseContext.coordinates),
            lastStepMeta: this.getLastStepMeta(),
            activeTeam: this.getActiveTeam()
        }).pipe(
            map(({player, playerHasBall, lastStepMeta, activeTeam }) => {
                return {
                    ...baseContext,
                    player: player,  
                    hex: this.grid.getHex(baseContext.coordinates),
                    playerHasBall: playerHasBall,
                    lastStepMeta: lastStepMeta,
                    activeTeam: activeTeam
                }
            })
        )
    }

}
