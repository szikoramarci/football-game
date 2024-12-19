import { equals } from "honeycomb-grid";
import { GameContext } from "../../classes/game-context.interface";
import { Rule } from "../../classes/rule";
import { MovingActionMeta } from "../../metas/moving.action-meta";

export class IsMoveTargetHexClicked implements Rule {
    validate(context: GameContext): boolean {
        const actionMeta = context.actionMeta as MovingActionMeta;        
        return equals(actionMeta.targetHex!, context.hex);
    }
    errorMessage = "not the target hex";
}