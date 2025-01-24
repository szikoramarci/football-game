import { OffsetCoordinates } from "@szikoramarci/honeycomb-grid";

export interface BallPositionState {
  ballPosition: OffsetCoordinates
}

export const initialState: BallPositionState = {
  ballPosition: { col: 4, row: 3 }
}