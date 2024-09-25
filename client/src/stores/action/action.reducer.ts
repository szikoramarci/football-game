import { createReducer, on } from "@ngrx/store";
import { initialState } from "./action.state";
import { clearActionMeta, saveActionMeta, setActionMode } from "./action.actions";

export const actionReducer = createReducer(
    initialState,
    on(saveActionMeta, (state, actionMeta) => ({      
      ...state,
      lastActionMeta: actionMeta
    }),),
    on(setActionMode, (state, { mode }) => ({      
      ...state,
      actionMode: mode
    }),),
    on(clearActionMeta, (state) => ({      
      ...state,
      lastActionMeta: undefined
    }),)
  );