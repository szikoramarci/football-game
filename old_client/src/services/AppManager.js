import { Application } from 'pixi.js';
import Field from '@/models/Field';
import Player from '@/models/Player';
import GridManager from './GridManager';
import { }

class AppManager {
    app;
    players;

    constructor(){
        if (!AppManager.instance) {            

            AppManager.instance = this;
        }

        return AppManager.instance;
    }

    async init() {
        await this.initApp();
        GridManager.initGrid();
        this.initField();
        this.initPlayers(); 
    }    

    async initApp() {
        this.app = new Application()
        await this.app.init({ antialias: true, resizeTo: window });

        this.app.stage.hitArea = this.app.screen;
    }

    initField() {
        GridManager.getGrid().forEach((hex) => {   
            const field = new Field(hex);                    
            this.app.stage.addChild(field.getGraphics());
        });
    }

    initPlayers() {
        this.players = [
            new Player('Messi','10'),
            new Player('Suarez','9'),
            new Player('Iniesta','7')
        ]
        this.players.forEach((player) => {
            this.app.stage.addChild(player.getGraphics());
        });
    }

    addChild(graphics: Graphics) {
        this.app.addChild(graphics);
    }

    getCanvas() {
        return this.app.canvas;
    }
}

export default new AppManager();