import { Injectable } from "@angular/core";
import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
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

    generateReachableHexes(centralPoint: Hex, distance: number, finalMovingPath: Grid<Hex> | null): Grid<Hex> {    
        const occupiedHexes = this.grid.createGrid()
            .setHexes(this.playerPositions)
            .setHexes(this.grid.getFrame())
            
        if (finalMovingPath) {
            occupiedHexes.setHexes(finalMovingPath.toArray())
        }

        return this.traverser.getReachableHexes(centralPoint, distance, occupiedHexes)
    }
   
}