import { createAction, props } from "@ngrx/store";
import { StepMeta } from "../../action-steps/interfaces/step-meta.interface";

export const saveStepMeta = createAction(
    '[Step] Save Step Meta',
    props<StepMeta>()
);

export const clearStepMeta = createAction('[Step] Clear Step Meta');