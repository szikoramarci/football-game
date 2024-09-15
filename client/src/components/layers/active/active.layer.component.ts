import { Component, OnInit } from "@angular/core";
import { ClickService } from "../../../services/click/click.service";
import { Store } from "@ngrx/store";
import { getPlayerByPosition } from "../../../stores/player-position/player-position.selector";
import { filter, forkJoin, map, Observable, of, switchMap, take } from "rxjs";
import { ProcessService } from "../../../services/process/process.service";
import { ProcessType } from "../../../processes/process.type.enum";
import { Hex, OffsetCoordinates } from "honeycomb-grid";
import { Player } from "../../../models/player.model";
import { getPlayer } from "../../../stores/player/player.selector";
import { GridService } from "../../../services/grid/grid.service";
import { ProcessContext } from "../../../processes/process.context.interface";
import { startProcess, stopProcess } from "../../../stores/process/process.actions";
import { Process } from "../../../processes/process.interface";
import { getActiveProcess } from "../../../stores/process/process.selector";
import { movePlayer } from "../../../stores/player-position/player-position.actions";

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

    getActiveProcessType(): Observable<ProcessType | undefined> {
        return this.store.select(getActiveProcess())
            .pipe(
                map(process => process ? process.processType : undefined),
                take(1)
            )
    }

    getActiveProcessContext(): Observable<ProcessContext | undefined> {
        return this.store.select(getActiveProcess())
            .pipe(
                map(process => process ? process.context : undefined),
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
                activeProcessType: this.getActiveProcessType(),
                hex: this.getClickedHex(coordinates)
            }).subscribe((context: ProcessContext) => {
                this.handlePickPlayer(context);
                this.handleMovePlayer(context, coordinates);                            
            });
        });
    }

    handlePickPlayer(context: ProcessContext){
        if (this.process.validate(ProcessType.PickPlayer, context)) {
            this.store.dispatch(startProcess({
                processType: ProcessType.PickPlayer,
                context: context
            }));
        }
    }

    handleMovePlayer(context: ProcessContext, coordinates: OffsetCoordinates){
        if (this.process.validate(ProcessType.MovePlayer, context)) {
            this.getActiveProcessContext()
            .pipe(
                filter((context): context is ProcessContext => !!context),
                map(context => context.player),
                filter((player): player is Player => !!player)
            )
            .subscribe(player => {
                this.store.dispatch(movePlayer( { playerID: player.id, position: coordinates})); 
                this.store.dispatch(stopProcess());                
            })                    
        }
    }

}