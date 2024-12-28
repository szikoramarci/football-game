import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { Grid, Hex } from "honeycomb-grid";
import { Graphics, Point } from "pixi.js";
import { DrawService } from "../../services/draw/draw.service";

@Component({
    selector: 'movement-path',
    standalone: true,
    templateUrl: './movement-path.component.html',
})
export class MovementPathComponent implements OnInit, OnDestroy, OnChanges {

    @Input() grid!: Grid<Hex>
    
    @Input() tackling: boolean = false

    @Output() onGraphicsChanged = new EventEmitter<Graphics>()
    
    path: Graphics = new Graphics();  

    lines: Point[][] = [];

    constructor(private draw: DrawService) {}

    ngOnInit(): void {      
        this.renderPath();
        this.sendGraphics();   
    }

    ngOnChanges(changes: SimpleChanges) { 
        if (changes['grid']){
            this.renderPath();  
        }         
    }

    renderPath(){
        this.resetGraphics();  
        this.calculateLines();
        this.drawLines();        
    }

    resetGraphics() {
        this.path.clear();
    }

    calculateLines() {
        this.lines = [];

        let previousPoint: Point | null = null;
        this.grid.forEach(hex => {
            const point: Point = new Point(hex.x, hex.y);
            if (previousPoint) {
                this.lines.push([previousPoint, point]);
            }
            previousPoint = point;            
        })
    }

    drawLines(){
        this.draw.drawMovingPathArrowLine(this.path, this.lines, this.tackling)
    }

    sendGraphics() {
        this.onGraphicsChanged.emit(this.path);
    }

    ngOnDestroy(): void {
        this.path.destroy();
    }
}
