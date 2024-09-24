import { OffsetCoordinates } from "honeycomb-grid";

export interface BallPositionState {
  ballPosition: OffsetCoordinates
}

export const initialState: BallPositionState = {
  ballPosition: { col: 4, row: 4}
};