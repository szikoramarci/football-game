import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Hex } from "honeycomb-grid";
import { Graphics } from "pixi.js";
import { ContextService } from "../../services/context/context.service";

@Component({
    selector: 'indicator',
    standalone: true,
    templateUrl: './indicator.component.html',
})
export class IndicatorComponent implements OnInit, OnDestroy {

    @Input() hex!: Hex;
    
    @Output() onGraphicsChanged = new EventEmitter<Graphics>()
    
    indicator: Graphics = new Graphics();  

    constructor(private context: ContextService) {}

    ngOnInit(): void {
        this.setDesign();       
        this.setPosition();       
        this.sendGraphics();
    }

    setDesign(){
        this.indicator.context = this.context.getStatusHoveredFieldContext();
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
