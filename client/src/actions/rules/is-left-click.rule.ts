import { ClickEventType } from "../../services/click/click-event.interface";
import { ActionContext } from "../interfaces/action.context.interface";
import { ActionRule } from "../interfaces/action.rule.interface";

export class IsLeftClick implements ActionRule {
    validate(context: ActionContext): boolean {
        return context.clickEventType == ClickEventType.LEFT_CLICK;
    }
    errorMessage = "it wasn't a left click";
}