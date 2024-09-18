import { ActionContext } from "../action-context/action.context.interface";

export interface ActionRule {
    validate(context: ActionContext): boolean;
    errorMessage: string;
}