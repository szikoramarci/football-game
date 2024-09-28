import { GraphicsContext } from "pixi.js";
import { Point } from "honeycomb-grid";

export default class FieldContext {
    context;

    constructor(corners: Point[]) {
        this.context = new GraphicsContext()
            .poly(corners);                
    }

    setFillColor(fillColor: any) {
        this.context.fill(fillColor)
    }

    enableStroke() {
        this.context.stroke({ color: '#006400', width: 4 })
    }

    getContext() {
        return this.context;
    }
}