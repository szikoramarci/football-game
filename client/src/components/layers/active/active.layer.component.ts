import { Component, OnInit } from "@angular/core";
import { ClickService } from "../../../services/click/click.service";
import { Store } from "@ngrx/store";
import { getPlayerByPosition } from "../../../stores/player-position/player-position.selector";
import { filter, forkJoin, map, Observable, of, switchMap, take } from "rxjs";
import { Hex, OffsetCoordinates } from "honeycomb-grid";
import { Player } from "../../../models/player.model";
import { getPlayer } from "../../../stores/player/player.selector";
import { GridService } from "../../../services/grid/grid.service";
import { movePlayer } from "../../../stores/player-position/player-position.actions";
import { ActionService } from "../../../services/action/action.service";
import { terminateAction, triggerAction } from "../../../stores/action/action.actions";
import { ActionContext } from "../../../actions/action.context.interface";
import { ActionType } from "../../../actions/action.type.enum";
import { getActiveAction } from "../../../stores/action/action.selector";

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
        private action: ActionService,
        private grid: GridService
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

    getActiveActionType(): Observable<ActionType | undefined> {
        return this.store.select(getActiveAction())
            .pipe(
                map(action => action ? action.actionType : undefined),
                take(1)
            )
    }

    getActiveActionContext(): Observable<ActionContext | undefined> {
        return this.store.select(getActiveAction())
            .pipe(
                map(action => action ? action.context : undefined),
                take(1)
            )
    }

    getClickedHex(coordinates: OffsetCoordinates): Observable<Hex | undefined> {
        // TODO valójában itt arra vagyunk kíváncsiak, hogy ezen a hexen mik a szabályok
        // külön HEX RULES bevezetése kellene
        return of(this.grid.getHex(coordinates));
    }

    initClickSubscriptions() {
        this.click.getLeftClicks().subscribe(coordinates => {            
            forkJoin({
                player: this.getClickedPlayer(coordinates),
                activeActionType: this.getActiveActionType(),
                hex: this.getClickedHex(coordinates),
                coordinates: of(coordinates)
            }).subscribe((context: ActionContext) => {
                this.handlePickPlayer(context);
                this.handleMovePlayer(context, coordinates);                            
            });
        });
    }

    handlePickPlayer(context: ActionContext){
        if (this.action.validate(ActionType.PickPlayer, context)) {
            this.store.dispatch(triggerAction({
                actionType: ActionType.PickPlayer,
                context: context
            }));
        }
    }

    handleMovePlayer(context: ActionContext, coordinates: OffsetCoordinates){
        if (this.action.validate(ActionType.MovePlayer, context)) {
            this.getActiveActionContext()
            .pipe(
                filter((context): context is ActionContext => !!context),
                map(context => context.player),
                filter((player): player is Player => !!player)
            )
            .subscribe(player => {
                this.store.dispatch(movePlayer( { playerID: player.id, position: coordinates})); 
                this.store.dispatch(terminateAction());                
            })                    
        }
    }

}