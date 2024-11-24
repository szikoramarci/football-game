import { StepContext } from "../../../action-steps/classes/step-context.interface";
import { StepRule } from "../../classes/step-rule.interface";

export class IsPlayerSelected implements StepRule {
    validate(context: StepContext): boolean {
        return !!context.player;
    }
    errorMessage = "pick a player";
}