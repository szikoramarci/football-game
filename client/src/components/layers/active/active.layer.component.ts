import { Component, OnInit } from "@angular/core";
import { ClickService } from "../../../services/click/click.service";
import { Store } from "@ngrx/store";
import { getPlayerByPosition } from "../../../stores/player-position/player-position.selector";
import { forkJoin, Observable, of, switchMap, take } from "rxjs";
import { Hex, OffsetCoordinates } from "honeycomb-grid";
import { Player } from "../../../models/player.model";
import { getPlayer } from "../../../stores/player/player.selector";
import { GridService } from "../../../services/grid/grid.service";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { getLastActionMeta } from "../../../stores/action/action.selector";
import { ActionService } from "../../../services/action/action.service";
import { ActionMeta } from "../../../actions/interfaces/action.meta.interface";
import { ClickEventType } from "../../../services/click/click-event.interface";

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
        private grid: GridService,
        private action: ActionService
    ) {}

    ngOnInit(): void {
        this.initClickSubscriptions();
    }

    getClickedPlayer(coordinates: OffsetCoordinates): Observable<Player | undefined> {
        return this.store.select(getPlayerByPosition(coordinates))
            .pipe(      
                switchMap(playerId => {
                    return playerId ? this.store.select(getPlayer(playerId)) : of(undefined);        
                }),
                take(1)
            )
    }

    getLastActionMeta(): Observable<ActionMeta | undefined> {
        return this.store.select(getLastActionMeta())
            .pipe(
                take(1)
            )
    }

    getClickedHex(coordinates: OffsetCoordinates): Observable<Hex | undefined> {
        // TODO valójában itt arra vagyunk kíváncsiak, hogy ezen a hexen mik a szabályok
        // külön HEX RULES bevezetése kellene
        return of(this.grid.getHex(coordinates));
    }

    getContext(clickEvent: ClickEventType, coordinates: OffsetCoordinates): Observable<ActionContext> {
        return forkJoin({
            clickEventType: of(clickEvent),
            coordinates: of(coordinates),
            hex: this.getClickedHex(coordinates),              
            player: this.getClickedPlayer(coordinates),
            lastActionMeta: this.getLastActionMeta(),                  
        });
    }



    initClickSubscriptions() {
        this.click.getClickEvents().subscribe(clickEvent => {
            const clickEventType: ClickEventType = clickEvent.type;
            const coordinates: OffsetCoordinates = clickEvent.coordinates;
            this.getContext(clickEventType, coordinates).subscribe((context: ActionContext) => {
                const availableAction = this.action.resolveAction(context);                       
                if (availableAction) {
                    this.action.executeAction(availableAction, context);
                }
            });        
        });


    }   

}