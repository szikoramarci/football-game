import { Injectable } from '@angular/core';
import { Grid, Hex, defineHex, rectangle, Orientation, Point, HexCoordinates } from 'honeycomb-grid';
import { ContextService } from '../context/context.service';

@Injectable({
    providedIn: 'root'
})
export class GridService {
    grid!: Grid<Hex>;

    constructor(private context: ContextService) {
        this.initGrid();
        this.setUpContexts();
    }

    initGrid() {
        const FootballHex = defineHex({ 
            dimensions: 60, 
            origin: 'topLeft',
            orientation: Orientation.FLAT,
        });
          
        this.grid = new Grid(FootballHex, rectangle({ width: 10, height: 5 }));
    }    

    setUpContexts(){
        const firstHex: Hex = this.grid.getHex([0,0])!;
        this.context.setUpContexts(firstHex.corners);
    }

    getGrid(): Grid<Hex> {
        return this.grid;
    }

    getHex(coordinate: HexCoordinates): Hex | undefined {
        return this.grid.getHex(coordinate);
    }
}