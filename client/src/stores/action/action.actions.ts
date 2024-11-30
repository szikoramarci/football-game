import { createAction, props } from "@ngrx/store";
import { StepMeta } from "../../action-steps/classes/step-meta.interface";
import { Action } from "../../actions/action.interface";

export const saveStepMeta = createAction(
    '[Step] Save Step Meta',
    props<StepMeta>()
);

export const clearStepMeta = createAction('[Step] Clear Step Meta');

export const setAvailableActions = createAction(
    '[Action] Set Available Actions',
    props<{ actions: Action[] }>()
);

export const setCurrentAction = createAction(
    '[Action] Set Current Action',
    props<{ action: Action }>()
);