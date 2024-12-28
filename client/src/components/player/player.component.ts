import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Container, Text, Graphics } from "pixi.js";
import { Player } from "../../models/player.model";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { GridService } from "../../services/grid/grid.service";
import { HexCoordinates } from "honeycomb-grid";
import { getPlayerPosition } from "../../stores/player-position/player-position.selector";
import { AnimateService } from "../../services/animate/animate.service";
import { PLAYER_KIT_FONT_SIZE, PLAYER_TOKEN_RADIUS } from "../../constants";
import { Team } from "../../models/team.enum";
import { TacklingHelperService } from "../../services/action-helper/tackling-helper.service";

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
    tackleTryingEventSubscription!: Subscription;

    mainColor!: string;
    outlineColor!: string;
    numberColor!: string;
    numberOutlineColor!: string;

    constructor(
        private store: Store,
        private grid: GridService,
        private animate: AnimateService,
        private tacklingHelper: TacklingHelperService
    ) {}

    ngOnInit(): void { 
        this.defineKitColors();
        this.generateToken();
        this.generateText();
        this.sendGraphics();        
        this.initPlayerPositionSubscription();   
        this.initTackleTryingSubscription();    
    }

    defineKitColors(){
        switch(this.player.team) {
            case Team.TEAM_A:
                this.mainColor = "#a50044";
                this.outlineColor = "black"
                this.numberColor = "#ffed02";
                this.numberOutlineColor = "#a50044"
                break;
            case Team.TEAM_B:
                this.mainColor = "white";
                this.outlineColor = "black"
                this.numberColor = "white";
                this.numberOutlineColor = "black"
                break;
        }
    }

    initPlayerPositionSubscription() {        
        this.playerMovementSubscription = this.store.select(getPlayerPosition(this.player.id))
            .subscribe(position => {                
                this.movePlayer(position);
            })        
    }

    async movePlayer(newCoordinates: HexCoordinates) {
        const hex = this.grid.getHex(newCoordinates);                
        if (hex) {            
            this.animate.move(this.graphics, hex)
        }
    }

    initTackleTryingSubscription() {
        this.tackleTryingEventSubscription = this.tacklingHelper.getTackleTryingEvents(this.player.id)
            .subscribe(coordinates => {
                this.tacklePlayer(coordinates)
            })
    }
    
    async tacklePlayer(newCoordinates: HexCoordinates) {
        const hex = this.grid.getHex(newCoordinates);                
        if (hex) {            
            this.animate.bounce(this.graphics, hex)
        }
    }

    generateText(){
        const text = new Text({
            text: this.player.kitNumber,
            style: {
                fill: this.numberColor,
                fontWeight: 'bold',
                fontSize: PLAYER_KIT_FONT_SIZE,
                stroke: { color: this.numberOutlineColor, width: PLAYER_TOKEN_RADIUS/6, join: 'round' },
            }
            
        });
        text.x = 0 - text.bounds.maxX / 2;
        text.y = 0 - text.bounds.maxY / 2;

        this.graphics.addChild(text);
    }

    generateToken(){
        const token = new Graphics().circle(0, 0, PLAYER_TOKEN_RADIUS);  
        token.fill(this.mainColor);
        token.stroke( { color: this.outlineColor, width: PLAYER_TOKEN_RADIUS/17 });

        this.graphics.addChild(token);
    }


    sendGraphics() {        
        this.onGraphicsChanged.emit(this.graphics);
    }

    ngOnDestroy(): void {
        this.graphics.destroy();
        this.playerMovementSubscription?.unsubscribe();
        this.tackleTryingEventSubscription?.unsubscribe()
    }
}
