import { createReducer, on } from "@ngrx/store";
import { initialState } from "./ball-position.state";
import { moveBall } from "./ball-position.actions";

export const ballPositionReducer = createReducer(
    initialState,
    on(moveBall, (position, newPosition) => ({
      ...position,
      ballPosition: newPosition      
    }))
  );