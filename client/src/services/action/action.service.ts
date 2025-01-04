import { Injectable } from "@angular/core"
import { combineLatest, map, Observable } from "rxjs"
import { RelocationService } from "../relocation/relocation.service"
import { GridService } from "../grid/grid.service"
import { PlayerWithPosition } from "../../interfaces/player-with-position.interface"
import { PlayerService } from "../player/player.service"
import { TacklingHelperService } from "../action-helper/tackling-helper.service"
import { Hex } from "honeycomb-grid"
import { getRelocationState } from "../../stores/relocation/relocation.selector"
import { Store } from "@ngrx/store"

@Injectable({
    providedIn: 'root'
})
export class ActionService {

    constructor(
        private relocation: RelocationService,
        private grid: GridService,
        private player: PlayerService,
        private tacklingHelper: TacklingHelperService,
        private store: Store
    ) {}

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
        return combineLatest([
            this.player.getPlayersWithPositions(),
            this.store.select(getRelocationState)   // FOR TRIGGERING THE STREAM REGENERATION
        ]).pipe(
            map(([playersWithPosition, _]) => {
                return playersWithPosition.filter(playerWithPosition => {               
                    if (playerWithPosition.player == undefined) return false

                    if (this.tacklingHelper.canPlayerTackle(playerWithPosition.player)) {
                        return true
                    }
                    
                    if (this.relocation.isPlayerMovable(playerWithPosition.player)) {
                        return true
                    }

                    if (this.relocation.isPlayerRelocatable(playerWithPosition.player)) {
                        return true
                    }

                    return false
                })
            })
        )
    }

}