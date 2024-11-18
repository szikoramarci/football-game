import { StepContext } from "../../interfaces/step-context.interface";
import { StepRule } from "../../interfaces/step-rule.interface";

export class IsOwnPlayer implements StepRule {
    validate(context: StepContext): boolean {
        return context.player?.team == context.activeTeam || false;
    }
    errorMessage = "pick from your own players";
}