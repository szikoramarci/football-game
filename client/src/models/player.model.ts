import { Team } from "./team.enum";

export class Player {
    id!: string;
    kitNumber!: string;
    name!: string;
    team!: Team;
    speed: number = 4;

    constructor(id: string, name: string, kitNumber: string, team: Team) {
        this.id = id;
        this.name = name;
        this.kitNumber = kitNumber;
        this.team = team;
    }
}