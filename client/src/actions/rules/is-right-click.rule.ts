import { MouseTriggerEventType } from "../../services/mouse-event/mouse-event.interface";
import { GameContext } from "../classes/game-context.interface";
import { Rule } from "../classes/step-rule.interface";

export class IsRightClick implements Rule {
    validate(context: GameContext): boolean {
        return context.mouseEventType == MouseTriggerEventType.RIGHT_CLICK;
    }
    errorMessage = "it wasn't a right click";
}