import { Injectable } from "@angular/core";
import { equals, Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { TraverserService } from "../traverser/traverser.service";
import { getPlayerPositions } from "../../stores/player-position/player-position.selector";
import { Store } from "@ngrx/store";
import { GridService } from "../grid/grid.service";

@Injectable({
    providedIn: 'root',
})
export class MovingHelperService {

    playerPositions: OffsetCoordinates[] = []

    constructor(
        private traverser: TraverserService,
        private store: Store,
        private grid: GridService
    ) {
        this.initSubscriptions()
    }

    initSubscriptions() {
        this.store.select(getPlayerPositions).subscribe(playerPositions => {
            this.playerPositions = Object.values(playerPositions)
        })
    }

    generateReachableHexes(centralPoint: Hex, distance: number, ballerAttackerHex: Hex, finalMovingPath: Grid<Hex> | null): Grid<Hex> {    
        const occupiedHexes = this.grid.createGrid()
            .setHexes(this.playerPositions)
            .setHexes(this.grid.getFrame())
            
        if (finalMovingPath) {
            occupiedHexes.setHexes(finalMovingPath.toArray())
        }

        const reachableHexes = this.traverser.getReachableHexes(centralPoint, distance, occupiedHexes)
        return this.extendReachableHexesWithTacklableBaller(ballerAttackerHex, occupiedHexes, reachableHexes, centralPoint, distance)        
    }

    extendReachableHexesWithTacklableBaller(ballerAttackerHex: Hex, occupiedHexes: Grid<Hex>, reachableHexes: Grid<Hex>, centralPoint: Hex, distance: number): Grid<Hex> {
        if (!ballerAttackerHex) return reachableHexes
        
        const occupiedHexesWithoutBaller = occupiedHexes.filter(hex => !equals(hex, ballerAttackerHex))
        const reachableHexesWithBaller = this.traverser.getReachableHexes(centralPoint, distance, occupiedHexesWithoutBaller)
        if (reachableHexesWithBaller.hasHex(ballerAttackerHex)) {
            reachableHexes.setHexes([ballerAttackerHex])
        }

        return reachableHexes
    }
}