import { Component, OnInit } from "@angular/core";
import { Player } from "../../../models/player.model";
import { PlayerComponent } from "../../player/player.component";
import { AppService } from "../../../services/app/app.service";
import { Container, Graphics } from "pixi.js";
import { Store } from "@ngrx/store";
import { getAllPlayers } from "../../../stores/player/player.selector";

@Component({
    selector: 'state-layer',
    standalone: true,
    imports: [PlayerComponent],
    templateUrl: './state.layer.component.html',
})
export class StateLayerComponent implements OnInit {

    players: Player[] = [];    

    container: Container = new Container(); 

    constructor(
        private app: AppService,
        private store: Store
    ){}

    ngOnInit(): void {        
        this.initPlayers();
        this.app.addChild(this.container);        
    }

    initPlayers() {
        this.store.select(getAllPlayers).subscribe(players => {
            this.players = Object.values(players);
        })
    }

    handleGraphics(fieldGraphics: Container) {
        this.container.addChild(fieldGraphics);
    }
}
