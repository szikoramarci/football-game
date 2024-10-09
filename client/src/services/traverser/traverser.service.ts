import { Injectable } from "@angular/core";
import { GridService } from "../grid/grid.service";
import { equals, Grid, Hex, HexCoordinates, line, OffsetCoordinates, pathFind, reachable, repeatWith, ring, spiral, Traverser } from "honeycomb-grid";
import { CoordinateService } from "../coordinate/coordinate.service";
import { Point } from "pixi.js";
import { PITCH_LENGTH, PITCH_WIDTH } from "../../constants";

@Injectable({
    providedIn: 'root'
})
export class TraverserService {

    constructor(
        private grid: GridService,
        private coordinate: CoordinateService
    ) {}

    getHexCenterDistanceInPixelsByHex(fromHex: Hex, toHex: Hex): number | null {
        const fromPoint = new Point(fromHex.x, fromHex.y);
        const toPoint = new Point(toHex.x, toHex.y)
        return this.coordinate.calculatePointDistance(fromPoint, toPoint)
    }

    getHexCenterDistanceInPixelsByCoordinates(from: HexCoordinates, to: HexCoordinates): number | null {
        const fromHex = this.grid.getGrid().getHex(from);
        const toHex = this.grid.getGrid().getHex(to);

        return fromHex && toHex ? this.getHexCenterDistanceInPixelsByHex(fromHex, toHex) : null;
    }

    getReachableHexes(centralPoint: HexCoordinates, distance: number, obstacles: Grid<Hex>) {
        const reachableTraverser = reachable(centralPoint, distance, obstacles);
        return this.grid.getGrid().traverse(reachableTraverser);
    }   
    
    getPathHexes(startPoint: HexCoordinates, endPoint: HexCoordinates, obstacles: Grid<Hex>) {
        const pathTraverser = pathFind(startPoint, endPoint, obstacles)
        return this.grid.getGrid().traverse(pathTraverser);
    }  
    
    getAreaByDistance(start: HexCoordinates, hexDistance: number, pixelDistance: number) {
        return this.grid.getGrid().traverse(spiral({ start: start, radius: hexDistance })).filter(hex => {
            const distance = this.getHexCenterDistanceInPixelsByCoordinates(start, hex); 
            return distance && distance < pixelDistance || false
        })
    }

    fieldOfView(start: HexCoordinates, obstaclesCoordinates: OffsetCoordinates[]): Traverser<Hex> {
        console.log(obstaclesCoordinates)
        return repeatWith(
            ring({
                center: start
            }),
            this.lineOfSight(start, obstaclesCoordinates),
            { includeSource: false },
        )
    }
      
    lineOfSight(start: HexCoordinates, obstaclesCoordinates: OffsetCoordinates[]): Traverser<Hex> {
        return (_, stop) => {
            console.log(stop)
          const result: Hex[] = []
          const sightLine = this.grid.getGrid().traverse(line({ start, stop: stop! }))          
      
          for (const hex of sightLine) {            
            // make sure the last tile is the opaque one  
            if (obstaclesCoordinates.find(obstaclesCoordinate => equals(obstaclesCoordinate, hex))) return result;
            result.push(hex)
          }
      
          return result
        }
      }
    
    getDirectLine(startPoint: HexCoordinates, endPoint: HexCoordinates, mousePosition: Point) {
        const result = this.grid.createGrid();
        const startHex = this.grid.getHex(startPoint);
        const endHex = this.grid.getHex(endPoint);
        if (startHex && endHex){
            const startPosition = new Point(startHex.x, startHex.y);
            const endPosition = new Point(endHex.x, endHex.y);
            const lineTraverser = line({ start: startPoint, stop: endPoint })
            const lineGrid = this.grid.getGrid().traverse(lineTraverser);
            const spiralTraversers: Traverser<Hex>[] = []; 
            lineGrid.forEach(lineStepHex => {
                spiralTraversers.push(spiral({ start: lineStepHex, radius: 1 }))
            })
            const thickLineGrid = this.grid.getGrid().traverse(spiralTraversers);
            
            thickLineGrid.forEach(hex => {
                if (this.lineIntersectsHex(startPosition, mousePosition, hex)){                    
                    result.setHexes([hex]);                  
                }
            })            
        }
        return result;        
    }

    lineIntersectsHex(startPoint: Point, endPoint: Point, hex: Hex): boolean {
        for(let i = 0; i < hex.corners.length; i++) {
            const edgeStart = hex.corners[i];
            const edgeEnd = hex.corners[(i + 1) % hex.corners.length]; // Hexagon oldala

            if (this.lineSegmentsIntersect(startPoint.x, startPoint.y, endPoint.x, endPoint.y, edgeStart.x, edgeStart.y, edgeEnd.x, edgeEnd.y)) {
                return true; // A vonal keresztezi ezt az oldalt
            }
        }
        return false;
    }
      
    lineSegmentsIntersect(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): boolean {
        const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

        if (denom === 0) {
            console.log(x1)
            // A vonalak párhuzamosak, ellenőrizzük, hogy fedik-e egymást
            return this.areLinesCollinearAndOverlap(x1, y1, x2, y2, x3, y3, x4, y4);
        }
      
        const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
        const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
      
        // A vonalak akkor metszenek, ha 0 <= ua <= 1 és 0 <= ub <= 1
        return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
    }

    // Ellenőrizzük, hogy a párhuzamos vonalak fedik-e egymást
    areLinesCollinearAndOverlap(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): boolean {
         // Ellenőrizzük, hogy a vonalak kollineárisak-e (egy egyenes mentén fekszenek)
        const isCollinear = (y2 - y1) * (x3 - x1) === (x2 - x1) * (y3 - y1) &&
        (y2 - y1) * (x4 - x1) === (x2 - x1) * (y4 - y1);

        if (!isCollinear) return false;

        // Ellenőrizzük, hogy a kollineáris vonalszakaszok átfedik-e egymást
        const overlapX = Math.max(x1, x2) >= Math.min(x3, x4) && Math.max(x3, x4) >= Math.min(x1, x2);
        const overlapY = Math.max(y1, y2) >= Math.min(y3, y4) && Math.max(y3, y4) >= Math.min(y1, y2);

        return overlapX && overlapY;
    }

}