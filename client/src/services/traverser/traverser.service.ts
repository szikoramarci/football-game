import { Injectable } from "@angular/core";
import { GridService } from "../grid/grid.service";
import { Direction, Grid, Hex, HexCoordinates, line, pathFind, reachable, ring, spiral } from "@szikoramarci/honeycomb-grid";
import { GeometryService } from "../geometry/geometry.service";
import { Point } from "pixi.js";

@Injectable({
    providedIn: 'root'
})
export class TraverserService {

    constructor(
        private grid: GridService,
        private geometry: GeometryService
    ) {}

    getHexCenterDistanceInPixelsByHex(fromHex: Hex, toHex: Hex): number | null {
        const fromPoint = new Point(fromHex.x, fromHex.y);
        const toPoint = new Point(toHex.x, toHex.y)
        return this.geometry.calculatePointDistance(fromPoint, toPoint)
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

    getNeighbors(centerPoint: HexCoordinates) {
        const neighborTraverse = ring({ radius: 1, center: centerPoint })
        return this.grid.getGrid().traverse(neighborTraverse);
    }

    getDirectLine(start: HexCoordinates, direction: Direction, length: number) {
        const lineTraverser = line({ start, direction, length })
        return this.grid.getGrid().traverse(lineTraverser);
    }
}