import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { Graphics, Point } from "pixi.js";
import { DrawService } from "../../services/draw/draw.service";

@Component({
    selector: 'passing-path',
    standalone: true,
    templateUrl: './passing-path.component.html',
})
export class PassingPathComponent implements OnInit, OnDestroy, OnChanges {

    @Input() passingPath!: Point[]
    
    @Output() onGraphicsChanged = new EventEmitter<Graphics>()
    
    path: Graphics = new Graphics();  

    lines: Point[][] = [];

    constructor(private draw: DrawService) {}

    ngOnInit(): void {      
        this.renderPath();
        this.sendGraphics();   
    }

    ngOnChanges(changes: SimpleChanges) { 
        if (changes['passingPath']){
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
        this.path.zIndex = 100
    }

    calculateLines() {
        this.lines = [this.passingPath];
    }

    drawLines(){
        this.draw.drawPathArrowLine(this.path, this.lines)
    }

    sendGraphics() {
        this.onGraphicsChanged.emit(this.path);
    }

    ngOnDestroy(): void {
        this.path.destroy();
    }
}
