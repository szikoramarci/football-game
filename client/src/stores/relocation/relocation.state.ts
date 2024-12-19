import { RelocationTurn } from "../../relocation/relocation-turn.interface";

export interface RelocationState {
  relocationTurns: RelocationTurn[]
  usedPlayers: Set<string>
}

export const initialState: RelocationState = {
  relocationTurns: [],
  usedPlayers: new Set()
};
