import { Injectable } from "@angular/core";
import { GridService } from "../grid/grid.service";
import { distinctUntilChanged, fromEvent, merge, Observable, Subject, tap, throttleTime } from "rxjs";
import { MouseTriggerEvent, MouseTriggerEventType } from "./mouse-event.interface";
import { equals, Hex } from "@szikoramarci/honeycomb-grid";
import { Point } from "pixi.js";

@Injectable({
    providedIn: 'root'
})
export class MouseEventService {

    mouseEvents: Subject<MouseTriggerEvent> = new Subject();

    constructor(
        private grid: GridService
    ) {}

    initClickListener(canvas: HTMLElement) {
        const leftClickEvents = fromEvent<MouseEvent>(canvas, MouseTriggerEventType.LEFT_CLICK);
        const rightClickEvents = fromEvent<MouseEvent>(canvas, MouseTriggerEventType.RIGHT_CLICK);
        const mouseMoveEvents = fromEvent<MouseEvent>(canvas, MouseTriggerEventType.MOUSE_MOVE).pipe(throttleTime(50));

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
            const hex = this.getHexFromEvent(position);
            if (hex) {
                this.mouseEvents.next({
                    type: eventType,
                    hex: hex
                });
            }            
        })
    }  
    
    getHexFromEvent(point: Point): Hex | undefined {                      
        return this.grid.findHexByPoint(point)
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
        return a.type == b.type && equals(a.hex, b.hex);
    }
    

}
    