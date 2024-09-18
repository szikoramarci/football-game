import { createAction, props } from "@ngrx/store";
import { ActionMeta } from "../../actions/interfaces/action.meta.interface";

export const triggerAction = createAction(
    '[Process] Trigger Action',
    props<ActionMeta>()
);

export const terminateAction = createAction('[Process] Terminate Action');