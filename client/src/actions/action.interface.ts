import { ActionContext } from "./action.context.interface";
import { ActionType } from "./action.type.enum";

export interface Action {
    actionType: ActionType,
    context: ActionContext
}