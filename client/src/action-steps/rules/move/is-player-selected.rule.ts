import { ActionStepContext } from "../../interfaces/action-step-context.interface";
import { ActionStepRule } from "../../interfaces/action-step-rule.interface";

export class IsPlayerSelected implements ActionStepRule {
    validate(context: ActionStepContext): boolean {
        return !!context.player;
    }
    errorMessage = "pick a player";
}