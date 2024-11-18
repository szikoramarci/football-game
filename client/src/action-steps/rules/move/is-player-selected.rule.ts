import { StepContext } from "../../interfaces/step-context.interface";
import { StepRule } from "../../interfaces/step-rule.interface";

export class IsPlayerSelected implements StepRule {
    validate(context: StepContext): boolean {
        return !!context.player;
    }
    errorMessage = "pick a player";
}