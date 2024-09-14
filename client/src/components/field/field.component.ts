import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Hex } from "honeycomb-grid";
import { Graphics } from "pixi.js";
import { ContextService } from "../../services/context/context.service";

@Component({
    selector: 'field',
    standalone: true,
    templateUrl: './field.component.html',
})
export class FieldComponent implements OnInit {

    @Input() hex!: Hex;
    
    @Output() onGraphicsChanged = new EventEmitter<Graphics>()
    
    field: Graphics = new Graphics();  

    constructor(private context: ContextService) {}

    ngOnInit(): void {
        this.setDesign();       
        this.setPosition();       
        this.sendGraphics();
    }

    setDark() {
        this.field.context = this.context.getDarkFieldContext();
    }

    setLight() {
        this.field.context = this.context.getLightFieldContext();
    }

    isDark() {
        return (this.hex.row % 3 == 0 && this.hex.col % 2 == 0) || (this.hex.row % 3 == 1 && this.hex.col % 2 == 1)
    }

    setDesign(){
        if (this.isDark()) {
            this.setDark();
        } else {
            this.setLight();
        }
    }

    setPosition(){
        this.field.x = this.hex.origin.x + this.hex.x;
        this.field.y = this.hex.origin.y + this.hex.y;
    }

    sendGraphics() {
        this.onGraphicsChanged.emit(this.field);
    }
}
