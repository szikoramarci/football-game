import { createReducer, on } from "@ngrx/store";
import { initialState } from "./action.state";
import { terminateAction, triggerAction } from "./action.actions";

export const actionReducer = createReducer(
    initialState,
    on(triggerAction, (state, actionMeta) => ({      
      ...state,
      actionMeta: actionMeta
    }),),
    on(terminateAction, (state) => ({      
      ...state,
      actionMeta: null
    }),)
  );