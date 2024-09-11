import { Application } from 'pixi.js';
import { defineHex, Grid, Orientation, rectangle, spiral } from 'honeycomb-grid';
import FieldContextManager from '@/services/FieldContextManager';
import Field from '@/models/Field';
import Player from '@/models/Player';
import FieldStatusManager from './FieldStatusManager';

class AppManager {
    app;
    grid;
    players;

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
        this.initPlayers(); 
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

    initPlayers() {
        this.players = [
            new Player('Messi','10')
        ]
        this.players.forEach((player) => {
            this.app.stage.addChild(player.getGraphics());
        });
    }

    getCanvas() {
        return this.app.canvas;
    }
}

export default new AppManager();