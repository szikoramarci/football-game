import FieldContextManager from '@/services/FieldContextManager';
import FieldStatusManager from '@/services/FieldStatusManager';
import { Graphics, Container } from 'pixi.js';

export default class FieldGraphics {
    col;
    row;
    container;
    field;
    hover;
    status = null;

    constructor(col, row, x, y) {
        this.col = col;
        this.row = row;

        this.generateContainer();
        this.generateField();
        this.generateHover();
        this.setPosition(x, y);
        this.setBaseDesign();
        this.initFieldStatusSubscription();
    }

    initFieldStatusSubscription(){
        FieldStatusManager.getFieldStatus().subscribe(fieldStatusList => {
            const newStatus = fieldStatusList.find(fieldStatus => fieldStatus.row == this.row && fieldStatus.col == this.col)?.status || null;
            if (this.status != newStatus){
                this.status = newStatus;
                switch(newStatus) {
                    case 'hovered':
                        this.setHover();
                        break;
                    default:
                        this.resetHover();
                }
            }
        });
    }

    setPosition(x, y) {
        this.container.x = x;
        this.container.y = y;
    }

    generateContainer(){
        this.container = new Container();
    }

    generateField(){
        this.field = new Graphics(FieldContextManager.getLightFieldContext());
        this.container.addChild(this.field);
    }

    generateHover(){
        this.hover = new Graphics(FieldContextManager.getStatusBaseFieldContext());
        this.container.addChild(this.hover);
    }

    getGraphics() {                              
        return this.container;
    }

    setHover() {        
        this.hover.context = FieldContextManager.getStatusHoveredFieldContext();
    }

    resetHover() {
        this.hover.context = FieldContextManager.getStatusBaseFieldContext();
    }

    setDark() {
        this.field.context = FieldContextManager.getDarkFieldContext();
    }

    setLight() {
        this.field.context = FieldContextManager.getLightFieldContext();
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