import { Injectable } from "@angular/core";
import { GridService } from "../grid/grid.service";
import { distinctUntilChanged, fromEvent, merge, Observable, Subject, tap, throttleTime } from "rxjs";
import { MouseTriggerEvent, MouseTriggerEventType } from "./mouse-event.interface";
import { equals, OffsetCoordinates } from "honeycomb-grid";
import { Point } from "pixi.js";

@Injectable({
    providedIn: 'root'
})
export class MouseEventService {

    mouseEvents: Subject<MouseTriggerEvent> = new Subject();

    constructor(
        private grid: GridService
    ) {
        this.initClickListener();
    }

    initClickListener() {
        const leftClickEvents = fromEvent<MouseEvent>(document, MouseTriggerEventType.LEFT_CLICK);
        const rightClickEvents = fromEvent<MouseEvent>(document, MouseTriggerEventType.RIGHT_CLICK);
        const mouseMoveEvents = fromEvent<MouseEvent>(document, MouseTriggerEventType.MOUSE_MOVE).pipe(throttleTime(50));

        merge(leftClickEvents, rightClickEvents, mouseMoveEvents)
        .pipe(
            tap(event => {
                event.preventDefault();
                event.stopPropagation();
            })
        )
        .subscribe((event) => {
            const eventType: MouseTriggerEventType = event.type as MouseTriggerEventType;
            const position: Point = new Point(event.clientX, event.clientY)
            const hexCoordinates = this.getHexCoordinatesFromEvent(position);
            if (hexCoordinates) {
                this.mouseEvents.next({
                    type: eventType,
                    coordinates: hexCoordinates,
                    position: position
                });
            }            
        })
    }  
    
    getHexCoordinatesFromEvent(point: Point): OffsetCoordinates | undefined {                      
        const hex = this.grid.findHexByPoint(point) ;
        return hex ? { col: hex.col, row: hex.row } : undefined; 
    }

    getMouseEvents(): Observable<MouseTriggerEvent> {
        return this.mouseEvents.pipe(
            distinctUntilChanged((prev, curr) => {
                if (curr.type == MouseTriggerEventType.MOUSE_MOVE) {
                  return this.isTheSameEvent(prev, curr);
                }
                return false;
            })
        );
    }

    isTheSameEvent(a: MouseTriggerEvent, b: MouseTriggerEvent) {
        return a.type == b.type && equals(a.coordinates, b.coordinates);
    }
    

}
    