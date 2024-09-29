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

    @Input() isPassingPathValid!: boolean;
    
    @Output() onGraphicsChanged = new EventEmitter<Graphics>()
    
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

    renderPath(){
        this.resetGraphics();  
        this.drawLine();        
    }

    resetGraphics() {
        this.path.clear();
    }

    drawLine(){
        this.draw.drawPassingPathArrowLine(this.path, this.passingPath, this.isPassingPathValid)
    }

    sendGraphics() {
        this.onGraphicsChanged.emit(this.path);
    }

    ngOnDestroy(): void {
        this.path.destroy();
    }
}
