import { Injectable } from '@angular/core';
import { Grid, Hex, defineHex, rectangle, pathFind, Orientation, HexCoordinates, line, reachable, Traverser, Direction, neighborOf, OffsetCoordinates, distance, ring, spiral } from 'honeycomb-grid';
import { ContextService } from '../context/context.service';
import { HEXA_RADIUS, PITCH_LENGTH, PITCH_WIDTH } from '../../constants';
import { DrawService } from '../draw/draw.service';
import { Point } from 'pixi.js';

const FootballHex = defineHex({ 
    dimensions: HEXA_RADIUS, 
    origin: 'topLeft',
    orientation: Orientation.FLAT,
});

@Injectable({
    providedIn: 'root'
})
export class GridService {

    private width: number = PITCH_LENGTH
    private height: number = PITCH_WIDTH

    grid!: Grid<Hex>;
    frame!: Grid<Hex>

    constructor(
        private context: ContextService,
        private draw: DrawService
    ) {
        this.initGrid();
        this.generateFrame();
        this.setUpContexts();
    }

    initGrid() {            
        this.grid = this.createGrid(rectangle({ width: this.width, height: this.height }));        
    }   
    
    generateFrame() {
        this.frame = this.createGrid([
            line({ start: neighborOf(this.getFirstHex(),Direction.NW), direction: Direction.E, length: this.width + 2 }),
            line({ direction: Direction.S, length: this.height + 1 }),
            line({ direction: Direction.W, length: this.width + 1 }),
            line({ direction: Direction.N, length: this.height + 1 }),
        ]);
    }

    createGrid(traverser?: Traverser<Hex> | Traverser<Hex>[]): Grid<Hex> {
        if (traverser) {
            return new Grid<Hex>(FootballHex, traverser);
        }
        return new Grid<Hex>(FootballHex)
    }

    getDistance(from: OffsetCoordinates, to: OffsetCoordinates): number {
        return this.grid.distance(from, to);
    }

    getHexCenterDistanceInPixels(from: HexCoordinates, to: HexCoordinates): number | null {
        const fromHex = this.grid.getHex(from);
        const toHex = this.grid.getHex(to);
        if (fromHex && toHex) {
            const fromPoint = new Point(fromHex.x, fromHex.y);
            const toPoint = new Point(toHex.x, toHex.y)
            return this.draw.calculatePointDistance(fromPoint, toPoint)
        }

        return null;
    }

    getFirstHex(): Hex {
        return this.grid.getHex([0,0])!;
    }

    setUpContexts(){        
        this.context.setUpContexts(this.getFirstHex().corners);
    }

    getFrame(): Grid<Hex> {
        return this.frame;
    }

    getGrid(): Grid<Hex> {
        return this.grid;
    }

    getHex(coordinate: HexCoordinates): Hex | undefined {
        return this.grid.getHex(coordinate);
    }

    findHexByPoint(point: Point): Hex | undefined {
        return this.grid.pointToHex(point, { allowOutside: false });
    }

    getReachableHexes(centralPoint: HexCoordinates, distance: number, obstacles: Grid<Hex>) {
        const reachableTraverser = reachable(centralPoint, distance, obstacles);
        return this.grid.traverse(reachableTraverser);
    }   
    
    getPathHexes(startPoint: HexCoordinates, endPoint: HexCoordinates, obstacles: Grid<Hex>) {
        const pathTraverser = pathFind(startPoint, endPoint, obstacles)
        return this.grid.traverse(pathTraverser);
    }   
    
    getDirectLine(startPoint: HexCoordinates, endPoint: HexCoordinates, mousePosition: Point) {
        const result = this.createGrid();
        const startHex = this.grid.getHex(startPoint);
        const endHex = this.grid.getHex(endPoint);
        if (startHex && endHex){
            const startPosition = new Point(startHex.x, startHex.y);
            const endPosition = new Point(endHex.x, endHex.y);
            const lineTraverser = line({ start: startPoint, stop: endPoint })
            const lineGrid = this.grid.traverse(lineTraverser);
            const spiralTraversers: Traverser<Hex>[] = []; 
            lineGrid.forEach(lineStepHex => {
                spiralTraversers.push(spiral({ start: lineStepHex, radius: 1 }))
            })
            const thickLineGrid = this.grid.traverse(spiralTraversers);
            
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