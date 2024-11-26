import { createReducer, on } from "@ngrx/store";
import { initialState } from "./action.state";
import { clearStepMeta, saveStepMeta, setAvailableActions, setLastAction } from "./action.actions";

export const actionReducer = createReducer(
    initialState,
    on(saveStepMeta, (state, stepMeta) => ({      
      ...state,
      lastStepMeta: stepMeta
    }),),
    on(clearStepMeta, (state) => ({      
      ...state,
      lastStepMeta: undefined
    }),),
    on(setLastAction, (state, props) => ({
      ...state,
      lastAction: props.action
    })),
    on(setAvailableActions, (state, props) => ({
      ...state,
      availableActions: props.actions
    }))
  );