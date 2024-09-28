import { Component, OnInit } from "@angular/core";
import { Player } from "../../../models/player.model";
import { PlayerComponent } from "../../player/player.component";
import { AppService } from "../../../services/app/app.service";
import { Container } from "pixi.js";
import { Store } from "@ngrx/store";
import { getAllPlayers } from "../../../stores/player/player.selector";
import { BallComponent } from "../../ball/ball.component";

@Component({
    selector: 'state-layer',
    standalone: true,
    imports: [PlayerComponent, BallComponent],
    templateUrl: './state.layer.component.html',
})
export class StateLayerComponent implements OnInit {

    players: Player[] = [];    

    container: Container = new Container({
        interactiveChildren: false,
        isRenderGroup: true
    }); 

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

    handleGraphics(fieldGraphics: Container, zIndex: number) {
        fieldGraphics.zIndex = zIndex;
        this.container.addChild(fieldGraphics);
    }
}
