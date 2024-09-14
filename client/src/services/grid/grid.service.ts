import { Injectable } from '@angular/core';
import { Grid, Hex, defineHex, rectangle, Orientation } from 'honeycomb-grid';
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
          
        this.grid = new Grid(FootballHex, rectangle({ width: 24, height: 12 }));
    }    

    setUpContexts(){
        const firstHex: Hex = this.grid.getHex([0,0])!;
        this.context.setUpContexts(firstHex.corners);
    }

    getGrid(): Grid<Hex> {
        return this.grid;
    }
}