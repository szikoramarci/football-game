import { ActionContext } from "../../interfaces/action.context.interface";
import { ActionRule } from "../../interfaces/action.rule.interface";

export class IsOwnPlayer implements ActionRule {
    validate(context: ActionContext): boolean {
        throw new Error("Method not implemented.");
    }
    errorMessage = "pick from your own players";
}