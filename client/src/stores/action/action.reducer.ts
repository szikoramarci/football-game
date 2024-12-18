import { createReducer, on } from "@ngrx/store";
import { initialState } from "./action.state";
import { clearStepMeta, saveStepMeta, setActionContext, setAvailableActions, setCurrentAction, setCurrentStepIndex, setSelectableActions, clearCurrentAction, clearActionContext } from "./action.actions";

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
      currentAction: props.action
    })),
    on(clearCurrentAction, (state) => ({
      ...state,
      currentAction: undefined
    })),
    on(setAvailableActions, (state, props) => ({
      ...state,
      availableActions: props.actions
    })),
    on(setSelectableActions, (state, props) => ({
      ...state,
      selectableActions: props.actions
    })),
    on(setActionContext, (state, props) => ({
      ...state,
      actionContext: props.actionContext
    })),
    on(clearActionContext, (state) => ({
      ...state,
      actionContext: undefined
    })),
    on(setCurrentStepIndex, (state, props) => ({
      ...state,
      currentStepIndex: props.index
    }))
  );