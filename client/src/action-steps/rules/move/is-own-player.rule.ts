import { ActionContext } from "../../classes/action-context.interface";
import { StepRule } from "../../classes/step-rule.interface";

export class IsOwnPlayer implements StepRule {
    validate(context: ActionContext): boolean {
        return context.player?.team == context.activeTeam || false;
    }
    errorMessage = "pick from your own players";
}