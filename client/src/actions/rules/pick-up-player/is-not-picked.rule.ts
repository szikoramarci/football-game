import { ActionContext } from "../../interfaces/action.context.interface";
import { ActionRule } from "../../action-rule/action.rule.interface";
import { ActionType } from "../../action.type.enum";

export class IsNotPicked implements ActionRule {
    validate(context: ActionContext): boolean {
        return context.activeActionType == ActionType.PickPlayer;
    }
    errorMessage = "pick a player first";
}