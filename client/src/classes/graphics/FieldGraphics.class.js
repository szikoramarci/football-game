import * as PIXI from 'pixi.js';

export default class FieldGraphics {
    col;
    row;
    corners;
    graphics

    constructor(col, row, corners) {
        this.col = col;
        this.row = row;
        this.corners = corners;   
        
        return this.getGraphics();
    }

    generateGraphics(){
        this.graphics = new PIXI.Graphics().poly(this.corners);     
    }

    getGraphics() {              
        this.generateGraphics();
        this.setBaseDesign();
        this.setClickable();
        return this.graphics;
    }

    setClickable() {
        this.graphics.eventMode = 'static';
        this.graphics.cursor = 'pointer';
    }

    setStroke() {
        this.graphics.stroke({ color: '#006400', width: 6 });
    }

    setDark() {
        this.graphics.fill({ color: '#006400' });
    }

    setLight() {
        this.graphics.fill({ color: '#7CFC00' });
    }

    isDark() {
        return (this.row % 3 == 0 && this.col % 2 == 0) || (this.row % 3 == 1 && this.col % 2 == 1)
    }

    setBaseDesign(){
        this.setStroke();
        if (this.isDark()) {
            this.setDark();
        } else {
            this.setLight();
        }
    }


  }