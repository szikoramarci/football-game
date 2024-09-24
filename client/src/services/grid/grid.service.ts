import { Injectable } from '@angular/core';
import { Grid, Hex, defineHex, rectangle, pathFind, Orientation, Point, HexCoordinates, line, reachable, Traverser, Direction, neighborOf } from 'honeycomb-grid';
import { ContextService } from '../context/context.service';

const FootballHex = defineHex({ 
    dimensions: 60, 
    origin: 'topLeft',
    orientation: Orientation.FLAT,
});

@Injectable({
    providedIn: 'root'
})
export class GridService {

    private width: number = 10
    private height: number = 5

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