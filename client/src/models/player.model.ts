import { OffsetCoordinates } from "honeycomb-grid";

export class Player {
    id!: string;
    kitNumber!: string;
    name!: string;
    initialPosition!: OffsetCoordinates;

    constructor(name: string, kitNumber: string, initialPosition: OffsetCoordinates) {
        this.id = btoa(name);
        this.name = name;
        this.kitNumber = kitNumber;
        this.initialPosition = initialPosition;
    }
}