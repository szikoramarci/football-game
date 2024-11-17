import { ActionStepContext } from "../../interfaces/action-step-context.interface";
import { ActionStepRule } from "../../interfaces/action-step-rule.interface";

export class HasThePlayerTheBall implements ActionStepRule {
    validate(context: ActionStepContext): boolean {
        return !!context.playerHasBall;
    }
    errorMessage = "pick a player with ball";
}