import { ActionContext } from "../../classes/action-context.interface";
import { StepRule } from "../../classes/step-rule.interface";

export class IsPlayerSelected implements StepRule {
    validate(context: ActionContext): boolean {
        return !!context.player;
    }
    errorMessage = "pick a player";
}