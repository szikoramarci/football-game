import { OffsetCoordinates } from "honeycomb-grid";

export interface PlayerPositionState {
  [playerID: string]: OffsetCoordinates
}

export const initialState: PlayerPositionState = {
  "messi": { col: 7, row: 5 },
  "suarez": { col: 2, row: 2 },
  "busquets": { col: 1, row: 4 },
  "piqué": { col: 1, row: 2 },
  "puyol": { col: 0, row: 3 },

  "ronaldo": { col: 5, row: 5 },
  "benzema": { col: 3, row: 1 },
  "ramos": { col: 4, row: 6 },
  "modric": { col: 3, row: 2 },
  "kroos": { col: 8, row: 5 }
};