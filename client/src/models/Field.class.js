import { Container } from 'pixi.js';
import FieldGraphics from '@/graphics/FieldGraphics.class';


export default class Field {
    hex;

    container;

    field;
    line;

    constructor(hex) {        
        this.hex = hex;
        this.createContainer();
        this.createField();
    }

    createContainer(){
        this.container = new Container();
    }

    createField(){
        this.field = new FieldGraphics(this.hex.col, this.hex.row, this.getPosition().x, this.getPosition().y);
        this.container.addChild(this.field.getGraphics());
    }

    getCenter() {
        return {
            x: this.hex.x,
            y: this.hex.y
        }
    }

    getPosition() {
        return { 
            x: this.hex.origin.x + this.getCenter().x, 
            y: this.hex.origin.y + this.getCenter().y
        }
    }

    getGraphics() {
        return this.container;
    }
      
/*
      this.field.getGraphics().on('pointerout', () => {
        if (grabbed) {
          this.field.setBaseDesign();
        }
      });

      this.field.getGraphics().on('pointerenter', () => {
        if (grabbed) {
          this.field.setHovered();
        }        
      });
      

      this.field.getGraphics().on('pointerdown', () => {
        if (grabbed) {
          playerToken.setPosition(center.x, center.y);
          playerToken.getGraphics().eventMode = 'static';
          this.field.setBaseDesign();
          grabbed = null;
        }      
      })  */   


  }