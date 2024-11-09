import { Injectable } from "@angular/core";
import { Sector } from "../../interfaces/sector.interface";
import { Grid, Hex } from "honeycomb-grid";
import { GeometryService } from "../geometry/geometry.service";

@Injectable({
    providedIn: 'root'
})
export class SectorService {

    constructor(
        private geometry: GeometryService
    ) {}

    removeUnsightTargets(startHex: Hex, availableTargets: Grid<Hex>, obstaclePositions: Grid<Hex>): Grid<Hex> {
        const sectors: Sector[] = this.generateSectorsFromObstacles(startHex, obstaclePositions)
        return this.filterVisibleTargets(startHex, availableTargets, sectors)
    }
  
    generateSectorsFromObstacles(startingHex: Hex, obstaclePositions: Grid<Hex>): Sector[] {
        const sectors: Sector[] = [];

        obstaclePositions.forEach(opponentPosition => {
            const edgePoints = this.geometry.findEdgePointsFromPointPerspective(
                startingHex,
                opponentPosition.corners
            );

            sectors.push({
                startAngle: this.geometry.calculateAngle(startingHex, edgePoints[0]),
                endAngle: this.geometry.calculateAngle(startingHex, edgePoints[1]),
                distance: this.geometry.calculatePointDistance(startingHex, opponentPosition)
            });
        });

        return sectors;
    }

    filterVisibleTargets(startingHex: Hex, availableTargets: Grid<Hex>, sectors: Sector[]): Grid<Hex> {
        return availableTargets.filter(targetHex => {            
            return !sectors.some(sector => this.geometry.isPointInSector(startingHex, targetHex, sector));
        });
    }
}