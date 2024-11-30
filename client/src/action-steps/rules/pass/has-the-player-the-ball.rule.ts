import { ActionContext } from "../../classes/action-context.interface";
import { StepRule } from "../../classes/step-rule.interface";

export class HasThePlayerTheBall implements StepRule {
    validate(context: ActionContext): boolean {
        return !!context.playerHasBall;
    }
    errorMessage = "pick a player with ball";
}