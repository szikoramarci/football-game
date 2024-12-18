import { createAction, props } from "@ngrx/store";
import { StepMeta } from "../../actions/classes/step-meta.interface";
import { GameContext } from "../../actions/classes/game-context.interface";
import { Action } from "../../actions/classes/action.class";
import { Type } from "@angular/core";

export const saveStepMeta = createAction(
    '[Step] Save Step Meta',
    props<StepMeta>()
);

export const clearStepMeta = createAction('[Step] Clear Step Meta');

export const setAvailableActions = createAction(
    '[Action] Set Available Actions',
    props<{ actions: Type<Action>[] }>()
);

export const setSelectableActions = createAction(
    '[Action] Set Selectable Actions',
    props<{ actions: Type<Action>[] }>()
);

export const setCurrentAction = createAction(
    '[Action] Set Current Action',
    props<{ action: Type<Action> }>()
);

export const clearCurrentAction = createAction('[Action] Clear Current Action');

export const setActionContext = createAction(
    '[Action] Set Action Context',
    props<{ actionContext: GameContext }>()
);

export const clearActionContext = createAction('[Action] Clear Action Context')

export const setCurrentStepIndex = createAction(
    '[Action] Set Current Step Index',
    props<{ index: number }>()
);