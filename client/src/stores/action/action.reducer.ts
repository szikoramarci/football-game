import { createReducer, on } from "@ngrx/store";
import { initialState } from "./action.state";
import { clearStepMeta, saveStepMeta, setActionContext, setAvailableActions, setCurrentAction, setCurrentStepIndex } from "./action.actions";

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
    on(setCurrentAction, (state, props) => ({
      ...state,
      currentAction: props.action,
      currentStepIndex: 0
    })),
    on(setAvailableActions, (state, props) => ({
      ...state,
      availableActions: props.actions
    })),
    on(setActionContext, (state, props) => ({
      ...state,
      actionContext: props.actionContext
    })),
    on(setCurrentStepIndex, (state, props) => ({
      ...state,
      currentStepIndex: props.index
    }))
  );