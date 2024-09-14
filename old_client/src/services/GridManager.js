import { defineHex, Grid, Orientation, rectangle } from 'honeycomb-grid';
import FieldContextManager from "./FieldContextManager";

class GridManager {
    grid;    
    constructor() {
        if (!GridManager.instance) {
            GridManager.instance = this;
        }

        return GridManager.instance;
    }

    initGrid() {
        const Hex = defineHex({ 
            dimensions: 60, 
            origin: 'topLeft',
            orientation: Orientation.FLAT,
        });
          
        this.grid = new Grid(Hex, rectangle({ width: 10, height: 5 }));
        this.setUpContexts();
    }

    setUpContexts() {
        const firstHex = this.grid.getHex([0,0]);
        FieldContextManager.setUpContexts(firstHex.corners);
    }

    getGrid() {
        return this.grid;
    }

}

export default new GridManager();