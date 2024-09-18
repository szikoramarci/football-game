import { ActionContext } from "../../interfaces/action.context.interface";
import { ActionRule } from "../../action-rule/action.rule.interface";

export class IsEmpty implements ActionRule {
    validate(context: ActionContext): boolean {
        return !context.player;
    }
    errorMessage = "choose an empty field";
}