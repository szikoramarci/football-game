import { createReducer, on } from "@ngrx/store";
import { initialState } from "./player-position.state";
import { movePlayer } from "./player-position.actions";

export const playerPositionReducer = createReducer(
    initialState,
    on(movePlayer, (state, { playerID, position }) => ({
      ...state,
      players: {
        ...state.players,
        [playerID]: position
      }
    }))
  );