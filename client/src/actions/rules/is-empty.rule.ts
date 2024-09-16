import { ActionContext } from "../action.context.interface";
import { ActionRule } from "../action.rule.interface";

export class IsEmpty implements ActionRule {
    isValid(context: ActionContext): boolean {
        return !context.player;
    }
    errorMessage = "choose an empty field";
}