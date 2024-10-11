import { Injectable } from "@angular/core";
import { Point } from "honeycomb-grid";
import { Sector } from "../../interfaces/sector.interface";

@Injectable({
    providedIn: 'root'
})
export class CoordinateService {

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
        return distance >= sector.distance && sector.startAngle <= angle && angle <= sector.endAngle;
    }

    findEdgePointsFromPointPerspective(startPoint: Point, points: Point[]): Point[] {
        const pointsWithAngles = points.map(point => ({
            point,
            angle: this.calculateAngle(startPoint, point)
        }));
      
        pointsWithAngles.sort((a, b) => a.angle - b.angle);
      
        const leftMost = pointsWithAngles[0].point;
        const rightMost = pointsWithAngles[pointsWithAngles.length - 1].point;
      
        return [leftMost, rightMost]
    }
    
}