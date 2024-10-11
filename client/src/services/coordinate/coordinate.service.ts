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

    getIntermediatePointsBetweenEndPoints(start: Point, end: Point): Point[] {
        const points: Point[] = [];
        
        const steps = 100; 
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = start.x + t * (end.x - start.x);
            const y = start.y + t * (end.y - start.y);
            
            const pointOnLine: Point = { x, y };               
            points.push(pointOnLine)
        }
      
        return points;
      }
    
}