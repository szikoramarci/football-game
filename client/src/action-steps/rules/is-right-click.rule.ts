import { MouseTriggerEventType } from "../../services/mouse-event/mouse-event.interface";
import { ActionContext } from "../classes/action-context.interface";
import { StepRule } from "../classes/step-rule.interface";

export class IsRightClick implements StepRule {
    validate(context: ActionContext): boolean {
        return context.mouseEventType == MouseTriggerEventType.RIGHT_CLICK;
    }
    errorMessage = "it wasn't a right click";
}