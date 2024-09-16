import { createAction, props } from "@ngrx/store";
import { Action } from "../../actions/action.interface";

export const triggerAction = createAction(
    '[Process] Trigger Action',
    props<Action>()
);

export const terminateAction = createAction('[Process] Terminate Action');