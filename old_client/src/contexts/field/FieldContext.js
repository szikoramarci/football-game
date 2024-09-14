import { GraphicsContext } from "pixi.js";

export default class FieldContext {
    context;

    constructor(corners) {
        this.context = new GraphicsContext()
            .poly(corners);                
    }

    setFillColor(fillColor) {
        this.context.fill(fillColor)
    }

    enableStroke() {
        this.context.stroke({ color: '#006400', width: 6 })
    }

    getContext() {
        return this.context;
    }
}