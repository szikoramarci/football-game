import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Container, Text, Graphics } from "pixi.js";
import { Player } from "../../models/player.model";

@Component({
    selector: 'player',
    standalone: true,
    templateUrl: './player.component.html',
})
export class PlayerComponent implements OnInit {
    
    @Input() player!: Player;

    @Output() onGraphicsChanged = new EventEmitter<Container>()
    
    graphics: Container = new Container();  

    constructor() {}

    ngOnInit(): void {    
        this.generateToken();
        this.generateText();
        this.sendGraphics();
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
        this.graphics.x = 400;
        this.graphics.y = 300;
        this.onGraphicsChanged.emit(this.graphics);
    }
}
