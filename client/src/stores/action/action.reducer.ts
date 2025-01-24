import { createReducer, on } from "@ngrx/store";
import { initialState } from "./action.state";
import { clearActionMeta, saveActionMeta, setGameContext, setCurrentAction, setCurrentStepIndex, setSelectableActions, clearCurrentAction, clearGameContext, setLastEvent, clearSelectableActions } from "./action.actions";

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
    on(setLastEvent, (state, props) => ({
      ...state,
      lastEvent: props.event
    })),
    on(setSelectableActions, (state, props) => ({
      ...state,
      selectableActions: props.actions
    })),
    on(clearSelectableActions, (state) => ({
      ...state,
      selectableActions: []
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