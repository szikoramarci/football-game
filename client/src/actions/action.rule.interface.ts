import { ActionContext } from "./action.context.interface";

export interface ActionRule {
    isValid(context: ActionContext): boolean;
    errorMessage: string;
}