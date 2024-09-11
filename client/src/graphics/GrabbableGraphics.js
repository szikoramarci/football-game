import GrabManager from "@/services/GrabManager";
import { Container } from "pixi.js";

export default class GrabbableGraphics {
    graphics;


    constructor() {
        this.initGraphics();
        this.initGrabEvent();
    }

    setPosition(x, y) {
        this.graphics.x = x;
        this.graphics.y = y;
    }

    initGraphics() {
        this.graphics = new Container();
        this.graphics.eventMode = 'static';
        this.graphics.cursor = 'pointer';
    }

    initGrabEvent() {
        this.graphics.on('pointerdown', () => {
            if (GrabManager.isAlreadyGrabbed(this)) {
                GrabManager.looseElement();
            } else {
                GrabManager.grabElement(this);
            }
        });
    }

    getGraphics() {    
        return this.graphics;
    }
}