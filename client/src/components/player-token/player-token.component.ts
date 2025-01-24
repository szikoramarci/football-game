import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { Container, Graphics, Text } from "pixi.js";
import { Player } from "../../models/player.model";
import { Team } from "../../models/team.enum";
import { PLAYER_KIT_FONT_SIZE, PLAYER_TOKEN_RADIUS } from "../../constants";
import { Point } from "@szikoramarci/honeycomb-grid";

@Component({
    selector: 'player-token',
    standalone: true,
    templateUrl: './player-token.component.html',
})
export class PlayerTokenComponent implements OnInit, OnChanges, OnDestroy {
    
    @Input() player!: Player
    @Input() position!: Point
    @Input() opacity: number = 1

    @Output() onGraphicsChanged = new EventEmitter<Container>()
    
    graphics: Container = new Container();  

    mainColor!: string;
    outlineColor!: string;
    numberColor!: string;
    numberOutlineColor!: string;

    constructor() {}

    ngOnInit(): void { 
        this.defineKitColors()
        this.generateToken()
        this.generateText()
        this.setPosition()
        this.setOpacity()
        this.sendGraphics()           
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['position']) {
            this.setPosition()
        }
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
        const token = new Graphics().circle(0, 0, PLAYER_TOKEN_RADIUS)
        token.fill(this.mainColor)
        token.stroke( { color: this.outlineColor, width: PLAYER_TOKEN_RADIUS/17 })        

        this.graphics.addChild(token);
    }

    setOpacity() {
        this.graphics.alpha = this.opacity
    }

    setPosition() {
        if (this.position) {
            this.graphics.x = this.position.x;
            this.graphics.y = this.position.y;
        }        
    }

    sendGraphics() {        
        this.onGraphicsChanged.emit(this.graphics);
    }

    ngOnDestroy(): void {
        this.graphics.destroy()
    }
}
