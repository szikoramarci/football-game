import { createReducer, on } from "@ngrx/store";
import { initialState } from "./gameplay.state";
import { setActiveTeam } from "./gameplay.actions";

export const gameplayReducer = createReducer(
    initialState,
    on(setActiveTeam, (state, { activeTeam }) => ({      
      ...state,
      activeTeam: activeTeam
    }),),
  );