import { Component, OnInit } from "@angular/core";
import { ClickService } from "../../../services/click/click.service";
import { Store } from "@ngrx/store";
import { getPlayerByPosition } from "../../../stores/player-position/player-position.selector";
import { filter, forkJoin, Observable, of, switchMap, take } from "rxjs";
import { ProcessService } from "../../../services/process/process.service";
import { ProcessType } from "../../../rules/process.type.enum";
import { Hex, OffsetCoordinates } from "honeycomb-grid";
import { Player } from "../../../models/player.model";
import { getPlayer } from "../../../stores/player/player.selector";
import { GridService } from "../../../services/grid/grid.service";

@Component({
    selector: 'active-layer',
    standalone: true,
    imports: [],
    templateUrl: './active.layer.component.html',
})
export class ActiveLayerComponent implements OnInit {

    constructor(
        private click: ClickService,
        private store: Store,
        private process: ProcessService,
        private grid: GridService
    ) {}

    ngOnInit(): void {
        this.initClickSubscriptions();
        /*this.click.clickEvents.
            subscribe((event) => {            
                if (event.coordinates !== undefined) {
                    this.store.select(getPlayerByPosition(event.coordinates)).pipe(
                        take(1)  
                    ).subscribe(playerID => {
                        console.log(playerID)
                    });
                }
            })  */  
    }

    getClickedPlayer(coordinates: OffsetCoordinates): Observable<Player> {
        return this.store.select(getPlayerByPosition(coordinates))
            .pipe(      
                filter((playerID): playerID is string => !!playerID),
                switchMap(playerId => {
                    return this.store.select(getPlayer(playerId))
                }),
                take(1)
            )
    }

    getClickedHex(coordinates: OffsetCoordinates): Observable<Hex | undefined> {
        // TODO valójában itt arra vagyunk kíváncsiak, hogy ezen a hexen mik a szabályok
        // külön HEX RULES bevezetése kellene
        return of(this.grid.getHex(coordinates));
    }

    initClickSubscriptions() {
        // PLAYER CLICK
        this.click.getLeftClicks().subscribe(coordinates => {            
            forkJoin({
                player: this.getClickedPlayer(coordinates),
                hex: this.getClickedHex(coordinates)
            }).subscribe(({ player, hex }) => {
                const context = {
                    player: player,
                    hex: hex
                }
                console.log(context);
                const pickPlayer = this.process.validate(ProcessType.PickPlayer, context);
            });
        });
    }

}