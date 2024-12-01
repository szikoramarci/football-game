import { createAction, props } from "@ngrx/store";
import { StepMeta } from "../../action-steps/classes/step-meta.interface";
import { Action } from "../../actions/action.interface";
import { ActionContext } from "../../action-steps/classes/action-context.interface";

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

export const clearCurentAction = createAction('[Action] Clear Current Action');

export const setActionContext = createAction(
    '[Action] Set Action Context',
    props<{ actionContext: ActionContext }>()
);

export const setCurrentStepIndex = createAction(
    '[Action] Set Current Step Index',
    props<{ index: number }>()
);