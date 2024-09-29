import { ActionContext } from "../../interfaces/action.context.interface";
import { ActionRule } from "../../interfaces/action.rule.interface";

export class IsOwnPlayer implements ActionRule {
    validate(context: ActionContext): boolean {
        return context.player?.team == context.activeTeam || false;
    }
    errorMessage = "pick from your own players";
}