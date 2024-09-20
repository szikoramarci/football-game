import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Grid, Hex, Point } from "honeycomb-grid";
import { Graphics } from "pixi.js";
import { ContextService } from "../../services/context/context.service";

@Component({
    selector: 'arrow-path',
    standalone: true,
    templateUrl: './arrow-path.component.html',
})
export class ArrowPathComponent implements OnInit, OnDestroy {

    @Input() grid!: Grid<Hex>;
    
    @Output() onGraphicsChanged = new EventEmitter<Graphics>()
    
    arrow: Graphics = new Graphics();  

    breakingPoints: Point[] = [];

    constructor(private context: ContextService) {}

    ngOnInit(): void {
        this.generateBreakingPoints();
        this.drawLines();
        this.sendGraphics();
    }

    generateBreakingPoints() {
        this.grid.forEach(hex => {
            const centerPoint = { x: hex.x, y: hex.y }
            this.breakingPoints.push(centerPoint);
        })
    }

    drawLines(){
        let previousPoint: Point | null = null;
        this.breakingPoints.forEach(point => {
            if (previousPoint) {
                this.arrow.lineTo(point.x, point.y)
                this.arrow.stroke({ width: 10, color: 'black' })
            } else {
                this.arrow.moveTo(point.x, point.y)
            }
            previousPoint = point;
        });
    }


    sendGraphics() {
        this.onGraphicsChanged.emit(this.arrow);
    }

    ngOnDestroy(): void {
        this.arrow.destroy();
    }
}
