import { ActionContext } from "../../action-context/action.context.interface";
import { ActionRule } from "../../action-rule/action.rule.interface";

export class IsPlayerSelected implements ActionRule {
    isValid(context: ActionContext): boolean {
        return !!context.player;
    }
    errorMessage = "pick a player";
}