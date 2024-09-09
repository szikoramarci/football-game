import { GraphicsContext } from "pixi.js";

export default class FieldContext {
    context;

    constructor(corners) {
        this.context = new GraphicsContext()
            .poly(corners)
            .stroke({ color: '#006400', width: 6 })    
    }

    setFillColor(fillColor) {
        this.context.fill(fillColor)
    }

    getContext() {
        return this.context;
    }
}