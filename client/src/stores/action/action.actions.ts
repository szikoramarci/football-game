import { createAction, props } from "@ngrx/store";
import { ActionStepMeta } from "../../action-steps/interfaces/action-step-meta.interface";

export const saveActionStepMeta = createAction(
    '[Action] Save Action Meta',
    props<ActionStepMeta>()
);

export const clearActionStepMeta = createAction('[Action] Clear Action Step Meta');