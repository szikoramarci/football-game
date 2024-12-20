import { createReducer, on } from "@ngrx/store";
import { initialState } from "./gameplay.state";
import { setAttackingTeam } from "./gameplay.actions";

export const gameplayReducer = createReducer(
    initialState,
    on(setAttackingTeam, (state, { attackingTeam }) => ({      
      ...state,
      attackingTeam: attackingTeam
    }),),
  );