import { MouseTriggerEventType } from "../../services/mouse-event/mouse-event.interface";
import { ActionContext } from "../interfaces/action.context.interface";
import { ActionRule } from "../interfaces/action.rule.interface";

export class IsMouseOver implements ActionRule {
    validate(context: ActionContext): boolean {
        return context.mouseEventType == MouseTriggerEventType.MOUSE_MOVE;
    }
    errorMessage = "it wasn't a mouse over";
}