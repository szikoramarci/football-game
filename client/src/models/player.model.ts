import { HexCoordinates } from "honeycomb-grid";

export class Player {
    id!: string;
    kitNumber!: string;
    name!: string;
    initialPosition!: HexCoordinates;

    constructor(name: string, kitNumber: string, initialPosition: HexCoordinates) {
        this.id = btoa(name);
        this.name = name;
        this.kitNumber = kitNumber;
        this.initialPosition = initialPosition;
    }
}