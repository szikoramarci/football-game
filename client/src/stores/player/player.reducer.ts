import { createReducer, on } from "@ngrx/store";
import { initialState } from "./player.state";
import { setPlayer } from "./player.actions";

export const playerReducer = createReducer(
    initialState,
    on(setPlayer, (players, player) => ({      
      ...players,
      [player.id]: player
    }),)
  );