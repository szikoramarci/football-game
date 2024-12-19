import { createReducer, on } from "@ngrx/store";
import { initialState } from "./action.state";
import { clearActionMeta, saveActionMeta, setGameContext, setAvailableActions, setCurrentAction, setCurrentStepIndex, setSelectableActions, clearCurrentAction, clearGameContext } from "./action.actions";

export const actionReducer = createReducer(
    initialState,
    on(saveActionMeta, (state, stepMeta) => ({      
      ...state,
      currentActionMeta: stepMeta
    }),),
    on(clearActionMeta, (state) => ({      
      ...state,
      currentActionMeta: undefined
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
    on(setGameContext, (state, props) => ({
      ...state,
      gameContext: props.gameContext
    })),
    on(clearGameContext, (state) => ({
      ...state,
      gameContext: undefined
    })),
    on(setCurrentStepIndex, (state, props) => ({
      ...state,
      currentStepIndex: props.index
    }))
  );