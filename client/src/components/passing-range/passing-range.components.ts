import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Graphics } from "pixi.js";
import { GridService } from "../../services/grid/grid.service";
import { STANDARD_PASS_PIXEL_DISTANCE } from "../../constants";
import { OffsetCoordinates } from "honeycomb-grid";

@Component({
    selector: 'passing-range',
    standalone: true,
    imports: [],
    templateUrl: './passing-range.component.html',
})
export class PassingRangeComponent implements OnInit {

    @Input() passerCoordinates!: OffsetCoordinates;
    
    @Output() onGraphicsChanged = new EventEmitter<Graphics>()
    
    range: Graphics = new Graphics();  

    constructor(private grid: GridService) {}

    ngOnInit(): void {
        this.setDesign();       
        this.setPosition();       
        this.sendGraphics();
    }

    setDesign(){
        this.range.circle(0, 0, STANDARD_PASS_PIXEL_DISTANCE);  
        this.range.stroke({ color: 'black', width: 3, alpha: 0.5 })
        this.range.fill({ color: 'black', alpha: 0.2})
        console.log(this.range.x, this.range.y)
    }

    setPosition(){        
        const hex = this.grid.getHex(this.passerCoordinates);
        if (hex) {
            this.range.x = hex.x;
            this.range.y = hex.y;
        }        
    }

    sendGraphics() {
        this.onGraphicsChanged.emit(this.range);
    }

    ngOnDestroy(): void {
        this.range.destroy();
    }
    
}