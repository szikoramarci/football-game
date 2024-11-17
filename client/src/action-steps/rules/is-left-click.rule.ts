import { MouseTriggerEventType } from "../../services/mouse-event/mouse-event.interface";
import { ActionStepContext } from "../interfaces/action-step-context.interface";
import { ActionStepRule } from "../interfaces/action-step-rule.interface";

export class IsLeftClick implements ActionStepRule {
    validate(context: ActionStepContext): boolean {
        return context.mouseEventType == MouseTriggerEventType.LEFT_CLICK;
    }
    errorMessage = "it wasn't a left click";
}