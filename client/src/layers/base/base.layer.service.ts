import { Injectable } from "@angular/core";
import { GridService } from "../../services/grid/grid.service";
import { Graphics } from "pixi.js";
import { Hex } from "honeycomb-grid";
import { ContextService } from "../../services/context/context.service";
import { AppService } from "../../services/app/app.service";

@Injectable({
    providedIn: 'root'
})
export class BaseLayerService {

    constructor(
        private grid: GridService,
        private context: ContextService,
        private app: AppService
    ) {}

    init() {
        this.grid.getGrid().forEach((hex) => {   
            const field = new Graphics;
            this.setDesign(hex, field);       
            this.setPosition(hex, field);           
            this.app.addChild(field);
        });
    }

    setDark(field: Graphics) {
        field.context = this.context.getDarkFieldContext();
    }

    setLight(field: Graphics) {
        field.context = this.context.getLightFieldContext();
    }

    isDark(hex: Hex) {
        return (hex.row % 3 == 0 && hex.col % 2 == 0) || (hex.row % 3 == 1 && hex.col % 2 == 1)
    }

    setDesign(hex: Hex, field: Graphics){
        if (this.isDark(hex)) {
            this.setDark(field);
        } else {
            this.setLight(field);
        }
    }

    setPosition(hex: Hex, field: Graphics){
        field.x = hex.origin.x + hex.x;
        field.y = hex.origin.y + hex.y;
    }
}