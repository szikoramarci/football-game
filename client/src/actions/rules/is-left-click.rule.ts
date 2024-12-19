import { MouseTriggerEventType } from "../../services/mouse-event/mouse-event.interface";
import { GameContext } from "../classes/game-context.interface";
import { Rule } from "../classes/rule";

export class IsLeftClick implements Rule {
    validate(context: GameContext): boolean {
        return context.mouseEventType == MouseTriggerEventType.LEFT_CLICK;
    }
    errorMessage = "it wasn't a left click";
}