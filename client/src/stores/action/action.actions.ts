import { createAction, props } from "@ngrx/store";
import { ActionMeta } from "../../actions/interfaces/action.meta.interface";

export const saveActionMeta = createAction(
    '[Action] Save Action Meta',
    props<ActionMeta>()
);

export const clearActionMeta = createAction('[Action] Clear Action Meta');