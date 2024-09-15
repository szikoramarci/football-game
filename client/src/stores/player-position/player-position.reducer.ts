import { createReducer, on } from "@ngrx/store";
import { updatePlayerPosition } from "./player-position.actions";
import { initialState } from "./player-position.state";

export const playerPositionReducer = createReducer(
    initialState,
    on(updatePlayerPosition, (state, { playerID, position }) => ({
      ...state,
      players: {
        ...state.players,
        [playerID]: position
      }
    }))
  );