import { OffsetCoordinates } from "honeycomb-grid";

export interface PlayerPositionState {
    players: { [playerID: string]: OffsetCoordinates };
  }
  
  export const initialState: PlayerPositionState = {
    players: {}
  };