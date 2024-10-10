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
}