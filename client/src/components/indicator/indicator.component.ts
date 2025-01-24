import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Hex } from "@szikoramarci/honeycomb-grid";
import { Graphics, GraphicsContext } from "pixi.js";

@Component({
    selector: 'indicator',
    standalone: true,
    templateUrl: './indicator.component.html',
})
export class IndicatorComponent implements OnInit, OnDestroy {

    @Input() hex!: Hex;

    @Input() graphicsContext!: GraphicsContext;
    
    @Output() onGraphicsChanged = new EventEmitter<Graphics>()
    
    indicator: Graphics = new Graphics();  

    ngOnInit(): void {
        this.setDesign();       
        this.setPosition();       
        this.sendGraphics();
    }

    setDesign(){
        this.indicator.context = this.graphicsContext
        this.indicator.zIndex = -1
    }

    setPosition(){        
        this.indicator.x = this.hex.origin.x + this.hex.x;
        this.indicator.y = this.hex.origin.y + this.hex.y;
    }

    sendGraphics() {
        this.onGraphicsChanged.emit(this.indicator);
    }

    ngOnDestroy(): void {
        this.indicator.destroy();
    }
}
