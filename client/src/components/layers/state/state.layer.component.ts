import { Component, OnInit } from "@angular/core";
import { Player } from "../../../models/player.model";
import { PlayerComponent } from "../../player/player.component";
import { AppService } from "../../../services/app/app.service";
import { Container, Graphics } from "pixi.js";

@Component({
    selector: 'state-layer',
    standalone: true,
    imports: [PlayerComponent],
    templateUrl: './state.layer.component.html',
})
export class StateLayerComponent implements OnInit {

    players: Player[] = [];    

    container: Container = new Container(); 

    constructor(private app: AppService){}

    ngOnInit(): void {
        const testPlayer = new Player("Messi","10");
        this.players.push(testPlayer);
        this.app.addChild(this.container);
    }

    handleGraphics(fieldGraphics: Container) {
        this.container.addChild(fieldGraphics);
    }
}
