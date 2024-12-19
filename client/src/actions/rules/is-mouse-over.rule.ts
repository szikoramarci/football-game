import { MouseTriggerEventType } from "../../services/mouse-event/mouse-event.interface";
import { GameContext } from "../classes/game-context.interface";
import { Rule } from "../classes/rule";

export class IsMouseOver implements Rule {
    validate(context: GameContext): boolean {
        return context.mouseEventType == MouseTriggerEventType.MOUSE_MOVE;
    }
    errorMessage = "it wasn't a mouse over";
}