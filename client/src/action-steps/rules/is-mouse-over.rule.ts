import { MouseTriggerEventType } from "../../services/mouse-event/mouse-event.interface";
import { StepContext } from "../classes/step-context.interface";
import { StepRule } from "../classes/step-rule.interface";

export class IsMouseOver implements StepRule {
    validate(context: StepContext): boolean {
        return context.mouseEventType == MouseTriggerEventType.MOUSE_MOVE;
    }
    errorMessage = "it wasn't a mouse over";
}