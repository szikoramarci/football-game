import { ActionContext } from "../../interfaces/action.context.interface";
import { ActionRule } from "../../interfaces/action.rule.interface";

export class IsPlayerSelected implements ActionRule {
    validate(context: ActionContext): boolean {
        return !!context.player;
    }
    errorMessage = "pick a player";
}