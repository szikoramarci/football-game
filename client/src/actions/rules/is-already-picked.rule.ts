import { ActionContext } from "../action.context.interface";
import { ActionRule } from "../action.rule.interface";
import { ActionType } from "../action.type.enum";

export class IsAlreadyPicked implements ActionRule {
    isValid(context: ActionContext): boolean {
        return context.activeActionType != ActionType.PickPlayer;
    }
    errorMessage = "already picked";
}