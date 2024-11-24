import { StepContext } from "../../../action-steps/classes/step-context.interface";
import { StepRule } from "../../classes/step-rule.interface";

export class HasThePlayerTheBall implements StepRule {
    validate(context: StepContext): boolean {
        return !!context.playerHasBall;
    }
    errorMessage = "pick a player with ball";
}