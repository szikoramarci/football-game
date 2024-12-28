import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { Graphics, Point } from "pixi.js";
import { DrawService } from "../../services/draw/draw.service";
import { Hex } from "honeycomb-grid";

@Component({
    selector: 'passing-path',
    standalone: true,
    templateUrl: './passing-path.component.html',
})
export class PassingPathComponent implements OnInit, OnDestroy, OnChanges {

    @Input() passingPath!: Hex[]    
    
    @Output() onGraphicsChanged = new EventEmitter<Graphics>()

    passingPathPoints: Point[] = []
    
    path: Graphics = new Graphics();  

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

    generatePoints(){
        const startHex = this.passingPath[0]
        const endHex = this.passingPath[1]
        const startPoint = new Point(startHex.x, startHex.y)
        const endPoint = new Point(endHex.x, endHex.y)

        this.passingPathPoints = [startPoint, endPoint];      
    }

    renderPath(){
        this.resetGraphics();  
        this.generatePoints()
        this.drawLine();        
    }

    resetGraphics() {
        this.path.clear();
    }

    drawLine(){        
        this.draw.drawPassingPathArrowLine(this.path, this.passingPathPoints)
    }

    sendGraphics() {
        this.onGraphicsChanged.emit(this.path);
    }

    ngOnDestroy(): void {
        this.path.destroy();
    }
}
