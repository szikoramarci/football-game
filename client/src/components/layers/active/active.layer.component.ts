import { Component, OnInit } from "@angular/core";
import { MouseEventService } from "../../../services/mouse-event/mouse-event.service";
import { Store } from "@ngrx/store";
import { getPlayerByPosition } from "../../../stores/player-position/player-position.selector";
import { forkJoin, map, Observable, of, switchMap, take } from "rxjs";
import { Hex, OffsetCoordinates } from "honeycomb-grid";
import { Player } from "../../../models/player.model";
import { getPlayer } from "../../../stores/player/player.selector";
import { GridService } from "../../../services/grid/grid.service";
import { StepContext } from "../../../action-steps/interfaces/step-context.interface";
import { getLastStepMeta } from "../../../stores/action/action.selector";
import { StepService } from "../../../services/action-step/step.service";
import { StepMeta } from "../../../action-steps/interfaces/step-meta.interface";
import { MouseTriggerEventType } from "../../../services/mouse-event/mouse-event.interface";
import { ActionSelectorComponent } from "../../action-selector/action-selector.component";
import { IsBallInPosition } from "../../../stores/ball-position/ball-position.selector";
import { getActiveTeam } from "../../../stores/gameplay/gameplay.selector";
import { Point } from "pixi.js";

@Component({
    selector: 'active-layer',
    standalone: true,
    imports: [ActionSelectorComponent],
    templateUrl: './active.layer.component.html',
})
export class ActiveLayerComponent implements OnInit {

    constructor(
        private mouseEvent: MouseEventService,
        private store: Store,
        private grid: GridService,
        private action: StepService
    ) {}

    ngOnInit(): void {
        this.initMouseEventSubscriptions();
    }

    getRelatedPlayer(coordinates: OffsetCoordinates): Observable<Player | undefined> {
        return this.store.select(getPlayerByPosition(coordinates))
            .pipe(      
                switchMap(playerId => {
                    return playerId ? this.store.select(getPlayer(playerId)) : of(undefined);        
                }),
                take(1)
            )
    }

    getLastActionStepMeta(): Observable<StepMeta | undefined> {
        return this.store.select(getLastStepMeta())
            .pipe(
                take(1)
            )
    }

    getActiveTeam(): Observable<string> {
        return this.store.select(getActiveTeam())
            .pipe(
                take(1)
            )
    }

    isPlayerHasBall(coordinates: OffsetCoordinates): Observable<boolean> {
        return this.store.select(IsBallInPosition(coordinates))
            .pipe(                
                take(1),
                map(IsBallInPosition => !!IsBallInPosition)    
            )
    }

    getRelatedHex(coordinates: OffsetCoordinates): Observable<Hex | undefined> {
        // TODO valójában itt arra vagyunk kíváncsiak, hogy ezen a hexen mik a szabályok
        // külön HEX RULES bevezetése kellene
        return of(this.grid.getHex(coordinates));
    }

    generateContext(mouseEventType: MouseTriggerEventType, coordinates: OffsetCoordinates, mousePosition: Point): Observable<StepContext> {
        return forkJoin({
            mouseEventType: of(mouseEventType),
            coordinates: of(coordinates),
            mousePosition: of(mousePosition),
            hex: this.getRelatedHex(coordinates),              
            player: this.getRelatedPlayer(coordinates),
            playerHasBall: this.isPlayerHasBall(coordinates),
            lastActionStepMeta: this.getLastActionStepMeta(),      
            activeTeam: this.getActiveTeam()            
        });
    }

    initMouseEventSubscriptions() {
        this.mouseEvent.getMouseEvents().subscribe(mouseEvent => {
            const mouseEventType: MouseTriggerEventType = mouseEvent.type;
            const coordinates: OffsetCoordinates = mouseEvent.coordinates;
            const mousePosition: Point = mouseEvent.position;
            this.generateContext(mouseEventType, coordinates, mousePosition).subscribe((context: StepContext) => {
                const availableAction = this.action.resolveStep(context);                       
                if (availableAction) {
                    this.action.executeStep(availableAction, context);
                }
            });        
        });
    }   

}