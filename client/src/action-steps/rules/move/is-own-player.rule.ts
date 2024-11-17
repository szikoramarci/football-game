import { ActionStepContext } from "../../interfaces/action-step-context.interface";
import { ActionStepRule } from "../../interfaces/action-step-rule.interface";

export class IsOwnPlayer implements ActionStepRule {
    validate(context: ActionStepContext): boolean {
        return context.player?.team == context.activeTeam || false;
    }
    errorMessage = "pick from your own players";
}