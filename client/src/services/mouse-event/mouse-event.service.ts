import { Injectable } from "@angular/core";
import { GridService } from "../grid/grid.service";
import { distinctUntilChanged, fromEvent, merge, Observable, Subject, tap, throttleTime } from "rxjs";
import { isMouseTriggerEventsEqual, MouseTriggerEvent, MouseTriggerEventType } from "./mouse-event.interface";
import { OffsetCoordinates, Point } from "honeycomb-grid";

@Injectable({
    providedIn: 'root'
})
export class MouseEventService {

    mouseEvents: Subject<MouseTriggerEvent> = new Subject();

    constructor(private grid: GridService) {
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
            const hexCoordinates = this.getHexCoordinatesFromEvent(event);
            if (hexCoordinates) {
                this.mouseEvents.next({
                    type: eventType,
                    coordinates: hexCoordinates
                });
            }            
        })
    }  
    
    getHexCoordinatesFromEvent(event: MouseEvent): OffsetCoordinates | undefined {
        const point: Point = { x: event.clientX, y: event.clientY };                        
        const hex = this.grid.findHexByPoint(point) ;
        return hex ? { col: hex.col, row: hex.row } : undefined; 
    }

    getMouseEvents(): Observable<MouseTriggerEvent> {
        return this.mouseEvents.pipe(
            distinctUntilChanged((prev, curr) => {
                if (curr.type == MouseTriggerEventType.MOUSE_MOVE) {
                  return isMouseTriggerEventsEqual(prev, curr);
                }
                return false;
            })
        );
    }

}
    