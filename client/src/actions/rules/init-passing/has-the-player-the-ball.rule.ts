import { ActionContext } from "../../interfaces/action.context.interface";
import { ActionRule } from "../../interfaces/action.rule.interface";

export class HasThePlayerTheBall implements ActionRule {
    validate(context: ActionContext): boolean {
        return !!context.playerHasBall;
    }
    errorMessage = "pick a player with ball";
}