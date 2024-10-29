import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Point } from "honeycomb-grid";
import { Graphics } from "pixi.js";

@Component({
    selector: 'point',
    standalone: true,
    templateUrl: './point.component.html',
})
export class PointComponent implements OnInit, OnDestroy {

    @Input() point!: Point;

    @Output() onGraphicsChanged = new EventEmitter<Graphics>()
    
    pointGraphics: Graphics = new Graphics().circle(0, 0, 5).fill('yellow');  

    ngOnInit(): void {   
        this.setPosition();       
        this.sendGraphics();
    }

    setPosition(){        
        this.pointGraphics.x = this.point.x;
        this.pointGraphics.y = this.point.y;
    }

    sendGraphics() {
        this.onGraphicsChanged.emit(this.pointGraphics);
    }

    ngOnDestroy(): void {
        this.pointGraphics.destroy();
    }
}
