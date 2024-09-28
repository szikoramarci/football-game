import { Injectable } from '@angular/core';
import { Grid, Hex, defineHex, rectangle, pathFind, Orientation, Point, HexCoordinates, line, reachable, Traverser, Direction, neighborOf, OffsetCoordinates, distance } from 'honeycomb-grid';
import { ContextService } from '../context/context.service';
import { HEXA_RADIUS, PITCH_LENGTH, PITCH_WIDTH } from '../../constants';

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

    constructor(private context: ContextService) {
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

    getDistanceInPixels(from: OffsetCoordinates, to: OffsetCoordinates): number | null {
        const formHex = this.grid.getHex(from);
        const toHex = this.grid.getHex(to);
        if (formHex && toHex) {
            return Math.sqrt(Math.pow(toHex.x - formHex.x, 2) + Math.pow(toHex.y - formHex.y, 2))
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
        const lineTraverser = pathFind(startPoint, endPoint, obstacles)
        return this.grid.traverse(lineTraverser);
    }      
}