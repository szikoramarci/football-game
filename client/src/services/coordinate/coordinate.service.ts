import { Injectable } from "@angular/core";
import { Point } from "honeycomb-grid";

@Injectable({
    providedIn: 'root'
})
export class CoordinateService {

    calculatePointDistance(point1: Point, point2: Point): number {
        const dx = point2.x - point1.x;
        const dy = point2.y - point1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
}