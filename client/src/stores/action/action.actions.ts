import { createAction, props } from "@ngrx/store";
import { ActionMeta } from "../../actions/interfaces/action.meta.interface";
import { ActionStrategy } from "../../actions/interfaces/action.strategy.interface";
import { Type } from "@angular/core";

export const saveActionMeta = createAction(
    '[Action] Save Action Meta',
    props<ActionMeta>()
);

export const setActionMode = createAction(
    '[Action] Set Action Mode',
    props<{ mode: Type<ActionStrategy> }>()
);

export const clearActionMeta = createAction('[Action] Clear Action Meta');