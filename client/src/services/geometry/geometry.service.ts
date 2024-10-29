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

    offsetLineToRectangle(start: Point, end: Point, offset: number): [Point, Point, Point, Point] {
      // Vonal vektorának meghatározása
      const dx = end.x - start.x;
      const dy = end.y - start.y;
    
      // Normál vektor meghatározása és méretezése
      const length = Math.sqrt(dx * dx + dy * dy);
      const nx = -dy / length * offset;
      const ny = dx / length * offset;
    
      // Téglalap sarkainak kiszámítása
      const rectPoint1: Point = { x: start.x + nx, y: start.y + ny };
      const rectPoint2: Point = { x: start.x - nx, y: start.y - ny };
      const rectPoint3: Point = { x: end.x - nx, y: end.y - ny };
      const rectPoint4: Point = { x: end.x + nx, y: end.y + ny };
    
      return [rectPoint1, rectPoint2, rectPoint3, rectPoint4];
    }

    isPointInRectangle(point: Point, rectPoints: [Point, Point, Point, Point], tolerance: number = 1e-10): boolean {
      const [p1, p2, p3, p4] = rectPoints;
    
      // Ellenőrizzük, hogy a pont mind a négy oldalon belül van-e
      const d1 = this.crossProduct(p1, p2, point);
      const d2 = this.crossProduct(p2, p3, point);
      const d3 = this.crossProduct(p3, p4, point);
      const d4 = this.crossProduct(p4, p1, point);
    
      // Az összes feltétel igaz, ha mind a négy előjel azonos vagy nullához közeli (szélen lévő pont)
      const isInsideOrOnEdge = 
      (Math.abs(d1) <= tolerance || d1 > 0) &&
      (Math.abs(d2) <= tolerance || d2 > 0) &&
      (Math.abs(d3) <= tolerance || d3 > 0) &&
      (Math.abs(d4) <= tolerance || d4 > 0) ||
      (Math.abs(d1) <= tolerance || d1 < 0) &&
      (Math.abs(d2) <= tolerance || d2 < 0) &&
      (Math.abs(d3) <= tolerance || d3 < 0) &&
      (Math.abs(d4) <= tolerance || d4 < 0);

      return isInsideOrOnEdge;
    }
    
}