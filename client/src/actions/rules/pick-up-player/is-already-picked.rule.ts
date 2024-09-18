import { ActionContext } from "../../interfaces/action.context.interface";

export class IsAlreadyPicked implements ActionRule {
    validate(context: ActionContext): boolean {
        return context.activeActionType != ActionType.PickPlayer;
    }
    errorMessage = "already picked";
}