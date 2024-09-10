import { Application } from 'pixi.js';
import { defineHex, Grid, Orientation, rectangle } from 'honeycomb-grid';
import FieldContextManager from '@/services/FieldContextManager';
import Field from '@/models/Field.class';

class AppManager {
    app;
    grid;

    constructor(){
        if (!AppManager.instance) {            

            AppManager.instance = this;
        }

        return AppManager.instance;
    }

    async init() {
        await this.initApp();
        this.initGrid();
        this.setUpContexts();
        this.initField();
    }    

    async initApp() {
        this.app = new Application()
        await this.app.init({ antialias: true, resizeTo: window });

        this.app.stage.hitArea = this.app.screen;
    }

    initGrid() {
        const Hex = defineHex({ 
            dimensions: 60, 
            origin: 'topLeft',
            orientation: Orientation.FLAT,
        });
          
        this.grid = new Grid(Hex, rectangle({ width: 10, height: 5 }))
    }

    setUpContexts() {
        const firstHex = this.grid.getHex([0,0]);
        FieldContextManager.setUpContexts(firstHex.corners);
    }

    initField() {
        this.grid.forEach((hex) => {   
        const field = new Field(hex);                    
            this.app.stage.addChild(field.getGraphics());
        });
    }

    getCanvas() {
        return this.app.canvas;
    }
}

export default new AppManager();