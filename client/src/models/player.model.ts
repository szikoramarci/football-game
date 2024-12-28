import { Team } from "./team.enum";

export class Player {
    id!: string;
    kitNumber!: string;
    name!: string;
    team!: Team;
    speed: number = 6
    dribbling: number = 1
    tackling: number = 1

    constructor(id: string, name: string, kitNumber: string, team: Team, speed: number, dribbling: number, tackling: number) {
        this.id = id;
        this.name = name;
        this.kitNumber = kitNumber;
        this.team = team;
        this.speed = speed
        this.dribbling = dribbling
        this.tackling = tackling
    }
}