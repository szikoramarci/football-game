import { createReducer, on } from "@ngrx/store";
import { initialState } from "./action.state";
import { clearActionMeta, saveActionMeta } from "./action.actions";

export const actionReducer = createReducer(
    initialState,
    on(saveActionMeta, (state, actionMeta) => ({      
      ...state,
      lastActionMeta: actionMeta
    }),),
    on(clearActionMeta, (state) => ({      
      ...state,
      lastActionMeta: undefined
    }),)
  );