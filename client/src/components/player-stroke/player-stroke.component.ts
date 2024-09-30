import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Container, Graphics } from "pixi.js";
import { GridService } from "../../services/grid/grid.service";
import { Hex, OffsetCoordinates } from "honeycomb-grid";
import { PLAYER_TOKEN_RADIUS } from "../../constants";

@Component({
    selector: 'player-stroke',
    standalone: true,
    templateUrl: './player-stroke.component.html',
})
export class PlayerStrokeComponent implements OnInit, OnDestroy {
    
    @Input() hex!: Hex;

    @Input() color: string = 'yellow';

    @Output() onGraphicsChanged = new EventEmitter<Graphics>()
    
    graphics: Graphics = new Graphics();

    constructor(
        private grid: GridService
    ) {}

    ngOnInit(): void { 
        this.generateStroke();
        this.setPosition();
        this.sendGraphics();              
    }

    generateStroke(){
        this.graphics = new Graphics().circle(0, 0, PLAYER_TOKEN_RADIUS*1.1);  
        this.graphics.stroke({ color: this.color, width: PLAYER_TOKEN_RADIUS/9 });
    }

    setPosition() {                          
        this.graphics.x = this.hex.x
        this.graphics.y = this.hex.y 
    }

    sendGraphics() {        
        this.onGraphicsChanged.emit(this.graphics);
    }

    ngOnDestroy(): void {
        this.graphics.destroy();
    }
}
