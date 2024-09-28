import { Injectable } from "@angular/core";
import { Application, Container, Ticker, UPDATE_PRIORITY } from 'pixi.js';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    app!: Application;

    async init() {
        this.app = new Application()
        await this.app.init({ antialias: true, resizeTo: window });         
    }

    addChild(graphics: Container) {
        this.app.stage.addChild(graphics);
    }

    getCanvas() {
        return this.app.canvas;
    }

    getRenderer() {
        return this.app;
    }
}