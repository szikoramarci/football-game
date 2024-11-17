import { MouseTriggerEventType } from "../../services/mouse-event/mouse-event.interface";
import { ActionStepContext } from "../interfaces/action-step-context.interface";
import { ActionStepRule } from "../interfaces/action-step-rule.interface";

export class IsRightClick implements ActionStepRule {
    validate(context: ActionStepContext): boolean {
        return context.mouseEventType == MouseTriggerEventType.RIGHT_CLICK;
    }
    errorMessage = "it wasn't a right click";
}