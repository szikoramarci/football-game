import { OffsetCoordinates } from "honeycomb-grid";

export interface BallPositionState {
  ballPosition: OffsetCoordinates
}

export const initialState: BallPositionState = {
  ballPosition: { col: 7, row: 5 }
}