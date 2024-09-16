import { createReducer, on } from "@ngrx/store";
import { initialState } from "./action.state";
import { terminateAction, triggerAction } from "./action.actions";

export const actionReducer = createReducer(
    initialState,
    on(triggerAction, (state, action) => ({      
      ...state,
      currentAction: action
    }),),
    on(terminateAction, (state) => ({      
      ...state,
      currentAction: null
    }),)
  );