import { createReducer, on } from "@ngrx/store";
import { initialState } from "./action.state";
import { clearActionStepMeta, saveActionStepMeta } from "./action.actions";

export const actionReducer = createReducer(
    initialState,
    on(saveActionStepMeta, (state, actionMeta) => ({      
      ...state,
      lastActionMeta: actionMeta
    }),),
    on(clearActionStepMeta, (state) => ({      
      ...state,
      lastActionMeta: undefined
    }),)
  );