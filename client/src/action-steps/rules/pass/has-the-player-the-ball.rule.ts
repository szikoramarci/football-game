import { StepContext } from "../../interfaces/step-context.interface";
import { StepRule } from "../../interfaces/step-rule.interface";

export class HasThePlayerTheBall implements StepRule {
    validate(context: StepContext): boolean {
        return !!context.playerHasBall;
    }
    errorMessage = "pick a player with ball";
}