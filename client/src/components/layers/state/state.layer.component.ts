import { Component, OnInit } from "@angular/core";
import { Player } from "../../../models/player.model";
import { PlayerComponent } from "../../player/player.component";
import { AppService } from "../../../services/app/app.service";
import { Container, Graphics } from "pixi.js";
import { Store } from "@ngrx/store";
import { updatePlayerPosition } from "../../../stores/player-position/player-position.actions";
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

    initPlayers(){
        this.players.push(new Player("Messi", "10", { col: 0, row: 1}));
        this.players.push(new Player("Suarez", "9", { col: 2, row: 1}));
        this.players.push(new Player("Neymar", "11", { col: 4, row: 1}));
        this.players.push(new Player("Busquets", "5", { col: 6, row: 1}));
        
        this.players.forEach((player) => {
            this.store.dispatch(updatePlayerPosition({ playerID: player.id, position: player.initialPosition}));
        });
    }

    handleGraphics(fieldGraphics: Container) {
        this.container.addChild(fieldGraphics);
    }
}
