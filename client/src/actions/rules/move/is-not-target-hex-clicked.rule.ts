import { equals } from "honeycomb-grid";
import { GameContext } from "../../classes/game-context.interface";
import { Rule } from "../../classes/rule";
import { MovingActionMeta } from "../../metas/moving.action-meta";

export class IsNotTargetHexClicked implements Rule {
    validate(context: GameContext): boolean {
        const actionMeta = context.actionMeta as MovingActionMeta;
        return this.isTargetHexNotSet(actionMeta) || !this.isTargetHexClicked(actionMeta, context)
    }
    errorMessage = "already selected hex as target";

    isTargetHexNotSet(actionMeta: MovingActionMeta) {
        return actionMeta.targetHex == undefined
    }

    isTargetHexClicked(actionMeta: MovingActionMeta, context: GameContext) {
        return equals(actionMeta.targetHex!, context.hex);
    }
}