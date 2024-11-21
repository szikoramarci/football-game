import { RelocationTurn } from "./relocation-turn.interface";

export interface RelocationScenario {
    name: string,
    turns: RelocationTurn[]
}