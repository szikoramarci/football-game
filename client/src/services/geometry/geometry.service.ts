import { Injectable } from "@angular/core";
import { Point } from "honeycomb-grid";
import { Sector } from "../../interfaces/sector.interface";

@Injectable({
    providedIn: 'root'
})
export class GeometryService {

    calculatePointDistance(point1: Point, point2: Point): number {
        const dx = point2.x - point1.x;
        const dy = point2.y - point1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    calculateAngle(center: Point, point: Point): number {
        return Math.atan2(point.y - center.y, point.x - center.x); // szög radiánban
    }

    
    isPointInSector(center: Point, point: Point, sector: Sector): boolean {
        const distance = this.calculatePointDistance(center, point)
        const angle = this.calculateAngle(center, point);
        return distance >= sector.distance && (sector.startAngle <= sector.endAngle ?
            (sector.startAngle <= angle && angle <= sector.endAngle) :
            (sector.startAngle <= angle || angle <= sector.endAngle))
    }

    findEdgePointsFromPointPerspective(startPoint: Point, hexPoints: Point[]): [Point, Point] {
        hexPoints.sort((a, b) => this.crossProduct(startPoint, a, b));
        return [hexPoints[hexPoints.length - 1], hexPoints[0]];
    }

    crossProduct(o: Point, a: Point, b: Point): number {
        return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    }
    
}