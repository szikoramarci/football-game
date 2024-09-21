import { ClickEventType } from "../../services/click/click-event.interface";
import { ActionContext } from "../interfaces/action.context.interface";
import { ActionRule } from "../interfaces/action.rule.interface";

export class IsRightClick implements ActionRule {
    validate(context: ActionContext): boolean {
        return context.clickEventType == ClickEventType.RIGHT_CLICK;
    }
    errorMessage = "it wasn't a right click";
}