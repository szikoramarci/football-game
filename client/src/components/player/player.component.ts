import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Container, Text, Graphics } from "pixi.js";
import { Player } from "../../models/player.model";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { GridService } from "../../services/grid/grid.service";
import { HexCoordinates } from "honeycomb-grid";
import { playerMoveEvent } from "../../stores/player-position/player-position.selector";

@Component({
    selector: 'player',
    standalone: true,
    templateUrl: './player.component.html',
})
export class PlayerComponent implements OnInit, OnDestroy {
    
    @Input() player!: Player;

    @Output() onGraphicsChanged = new EventEmitter<Container>()
    
    graphics: Container = new Container();  

    playerMovementSubscription!: Subscription;

    constructor(
        private store: Store,
        private grid: GridService
    ) {}

    ngOnInit(): void { 
        this.generateToken();
        this.generateText();
        this.sendGraphics();        
        this.initPlayerPositionSubscription();       
    }

    initPlayerPositionSubscription() {        
        this.playerMovementSubscription = this.store.select(playerMoveEvent(this.player.id))
            .subscribe(position => {
                this.movePlayer(position);
            })
    }

    movePlayer(newCoordinates: HexCoordinates) {
        const hex = this.grid.getHex(newCoordinates);
        if (hex) {
            this.graphics.x = hex.x;
            this.graphics.y = hex.y;
        }
    }

    generateText(){
        const text = new Text({
            text: this.player.kitNumber,
            style: {
                fill: 'white',
                fontWeight: 'bold',
                fontSize: 40,
                stroke: { color: 'black', width: 7, join: 'round' },
            }
            
        });
        text.x = 0 - text.bounds.maxX / 2;
        text.y = 0 - text.bounds.maxY / 2;

        this.graphics.addChild(text);
    }

    generateToken(){
        const token = new Graphics().circle(0, 0, 40);  
        token.fill('white');
        token.stroke( { color: 'black', width: 3 });

        this.graphics.addChild(token);
    }


    sendGraphics() {        
        this.onGraphicsChanged.emit(this.graphics);
    }

    ngOnDestroy(): void {
        this.graphics.destroy();
        this.playerMovementSubscription?.unsubscribe();
    }
}
