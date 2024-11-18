import { MouseTriggerEventType } from "../../services/mouse-event/mouse-event.interface";
import { StepContext } from "../interfaces/step-context.interface";
import { StepRule } from "../interfaces/step-rule.interface";

export class IsRightClick implements StepRule {
    validate(context: StepContext): boolean {
        return context.mouseEventType == MouseTriggerEventType.RIGHT_CLICK;
    }
    errorMessage = "it wasn't a right click";
}