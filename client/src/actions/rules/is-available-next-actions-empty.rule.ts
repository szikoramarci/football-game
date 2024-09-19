import { ActionContext } from "../interfaces/action.context.interface";
import { ActionRule } from "../interfaces/action.rule.interface";

export class IsAvailableNextActionsEmpty implements ActionRule {
    validate(context: ActionContext): boolean {
        return context.lastActionMeta == undefined || context.lastActionMeta.availableNextActions.length == 0;
    }
    errorMessage = "availalbe next actions are not empty";
}