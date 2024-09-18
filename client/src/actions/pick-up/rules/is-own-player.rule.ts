import { ActionContext } from "../../action-context/action.context.interface";
import { ActionRule } from "../../action-rule/action.rule.interface";

export class IsOwnPlayer implements ActionRule {
    isValid(context: ActionContext): boolean {
        return true;
    }
    errorMessage = "pick from your own players";
}