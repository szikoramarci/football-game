import { OffsetCoordinates } from "honeycomb-grid";

export interface BallPositionState {
  ballPosition: OffsetCoordinates
}

export const initialState: BallPositionState = {
  ballPosition: { col: 1, row: 2 }
}