import { Container } from 'pixi.js';
import FieldGraphics from '@/graphics/FieldGraphics';
import GrabManager from '@/services/GrabManager';
import FieldStatusManager from '@/services/FieldStatusManager';
import PlayerMovementManager from '@/services/PlayerMovementManager';


export default class Field {
    hex;

    container;

    field;
    line;

    constructor(hex) {        
        this.hex = hex;
        this.createContainer();
        this.createField();    
        this.initEvents();
    }

    createContainer(){
        this.container = new Container();
        this.container.eventMode = 'static';
        this.container.cursor = 'pointer';
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

    initEvents() {
      this.container.on('pointerenter', () => { 
       if (GrabManager.isGrabbed()) {    
          FieldStatusManager.addFieldStatus(this.hex.col, this.hex.row, 'hovered');      
          FieldStatusManager.broadcast();
        }
      });

      this.container.on('pointerdown', () => { 
        if (GrabManager.isGrabbed()) {      
          const { x, y } = this.getCenter();
          GrabManager.getGrabbedElement().move(x, y);                     
          PlayerMovementManager.move(GrabManager.getGrabbedElement(),this.hex);
          GrabManager.looseElement();
        }
      });
    }

    getGraphics() {
        return this.container;
    }
      
/*
    

      this.field.getGraphics().on('pointerdown', () => {
        if (grabbed) {
          playerToken.setPosition(center.x, center.y);
          playerToken.getGraphics().eventMode = 'static';
          this.field.setBaseDesign();
          grabbed = null;
        }      
      })  */   


  }