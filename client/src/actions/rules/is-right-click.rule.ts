import { MouseTriggerEventType } from "../../services/mouse-event/mouse-event.interface";
import { ActionContext } from "../interfaces/action.context.interface";
import { ActionRule } from "../interfaces/action.rule.interface";

export class IsRightClick implements ActionRule {
    validate(context: ActionContext): boolean {
        return context.mouseEventType == MouseTriggerEventType.RIGHT_CLICK;
    }
    errorMessage = "it wasn't a right click";
}