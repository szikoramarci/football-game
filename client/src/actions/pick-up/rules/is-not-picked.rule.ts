import { ActionContext } from "../../action-context/action.context.interface";
import { ActionRule } from "../../action-rule/action.rule.interface";
import { ActionType } from "../../action.type.enum";

export class IsNotPicked implements ActionRule {
    isValid(context: ActionContext): boolean {
        return context.activeActionType == ActionType.PickPlayer;
    }
    errorMessage = "pick a player first";
}