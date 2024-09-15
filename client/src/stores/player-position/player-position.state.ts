import { HexCoordinates } from "honeycomb-grid";

export interface PlayerPositionState {
    players: { [playerID: string]: HexCoordinates };
  }
  
  export const initialState: PlayerPositionState = {
    players: {}
  };