import { ActionContext } from "../../interfaces/action.context.interface";
import { ActionRule } from "../../interfaces/action.rule.interface";

export class IsOwnPlayer implements ActionRule {
    validate(context: ActionContext): boolean {
        return true; // TODO implementálni ezt a logikát
    }
    errorMessage = "pick from your own players";
}