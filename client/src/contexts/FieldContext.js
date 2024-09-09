import { GraphicsContext } from "pixi.js";

export default class FieldContext {
    lightContext;
    darkContext;
    hoveredContext;

    constructor(corners) {
        this.generateLightContext(corners);
        this.generateDarkContext(corners); 
        this.generateHoveredContext(corners);       
    }

    generateLightContext(corners){
        this.lightContext = new GraphicsContext()
            .poly(corners)
            .stroke({ color: '#006400', width: 6 })
            .fill({ color: '#7CFC00' });
    }

    getLightContext() {
        return this.lightContext;
    }

    generateDarkContext(corners){
        this.darkContext = new GraphicsContext()
            .poly(corners)
            .stroke({ color: '#006400', width: 6 })
            .fill({ color: '#006400' });
    }

    getDarkContext()  {
        return this.darkContext;
    }

    generateHoveredContext(corners){
        this.hoveredContext = new GraphicsContext()
            .poly(corners)
            .stroke({ color: '#006400', width: 6 })
            .fill({ color: 'red' });
    }

    getHoveredContext()  {
        return this.hoveredContext;
    }
}