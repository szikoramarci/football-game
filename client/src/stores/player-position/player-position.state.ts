import { OffsetCoordinates } from "honeycomb-grid";

export interface PlayerPositionState {
  [playerID: string]: OffsetCoordinates
}

export const initialState: PlayerPositionState = {
  "messi": { col: 4, row: 4 },
  "suarez": { col: 2, row: 2 },
  "busquets": { col: 1, row: 4 },
  "piqué": { col: 1, row: 2 },
  "puyol": { col: 0, row: 3 }
};