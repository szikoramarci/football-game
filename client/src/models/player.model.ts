import { OffsetCoordinates } from "honeycomb-grid";

export class Player {
    id!: string;
    kitNumber!: string;
    name!: string;
    speed: number = 2;

    constructor(id: string, name: string, kitNumber: string) {
        this.id = id;
        this.name = name;
        this.kitNumber = kitNumber;
    }
}