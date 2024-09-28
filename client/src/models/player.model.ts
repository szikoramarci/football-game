import { OffsetCoordinates } from "honeycomb-grid";

export class Player {
    id!: string;
    kitNumber!: string;
    name!: string;
    team!: string;
    speed: number = 4;

    constructor(id: string, name: string, kitNumber: string, team: string) {
        this.id = id;
        this.name = name;
        this.kitNumber = kitNumber;
        this.team = team;
    }
}