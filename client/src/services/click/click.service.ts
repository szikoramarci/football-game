import { Injectable } from "@angular/core";
import { GridService } from "../grid/grid.service";
import { fromEvent, map, merge, Subject } from "rxjs";
import { ClickEvent, ClickEventType } from "./clickEvent.interface";
import { HexCoordinates, OffsetCoordinates, Point } from "honeycomb-grid";

@Injectable({
    providedIn: 'root'
})
export class ClickService {

    clickEvents: Subject<ClickEvent> = new Subject();

    constructor(private grid: GridService) {
        this.initClickListener();
    }

    initClickListener() {
        const leftClickEvents = fromEvent<MouseEvent>(document, 'click');
        const rightClickEvents = fromEvent<MouseEvent>(document, 'contextmenu');
        merge(leftClickEvents,rightClickEvents)
        .subscribe((event) => {
            const eventType: ClickEventType = event.button;
            const hexCoordinates = this.getHexCoordinatesFromEvent(event);
            this.clickEvents.next({
                type: eventType,
                coordinates: hexCoordinates
            });
        })
    }  
    
    getHexCoordinatesFromEvent(event: MouseEvent): OffsetCoordinates | undefined {
        const point: Point = { x: event.clientX, y: event.clientY };                        
        const hex = this.grid.findHexByPoint(point) ;
        return hex ? { col: hex.col, row: hex.row } : undefined; 
    }
}
    