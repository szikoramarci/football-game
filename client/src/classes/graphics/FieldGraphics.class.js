import FieldContextManager from '@/contexts/field/FieldContextManager';
import { Graphics } from 'pixi.js';

export default class FieldGraphics {
    col;
    row;
    graphics;

    constructor(col, row, x, y) {
        this.col = col;
        this.row = row;

        this.generateGraphics();
        this.setPosition(x, y);
        this.setBaseDesign();
        this.setClickable();
    }

    setPosition(x, y) {
        this.graphics.x = x;
        this.graphics.y = y;
    }

    generateGraphics(){
        this.graphics = new Graphics(FieldContextManager.getLightFieldContext());
    }

    getGraphics() {                              
        return this.graphics;
    }

    setClickable() {
        this.graphics.eventMode = 'static';
        this.graphics.cursor = 'pointer';
    }

    setHovered() {
        this.graphics.context = FieldContextManager.getHoveredFieldContext();
    }

    setDark() {
        this.graphics.context = FieldContextManager.getDarkFieldContext();
    }

    setLight() {
        this.graphics.context = FieldContextManager.getLightFieldContext();
    }

    isDark() {
        return (this.row % 3 == 0 && this.col % 2 == 0) || (this.row % 3 == 1 && this.col % 2 == 1)
    }

    setBaseDesign(){
        if (this.isDark()) {
            this.setDark();
        } else {
            this.setLight();
        }
    }

  }