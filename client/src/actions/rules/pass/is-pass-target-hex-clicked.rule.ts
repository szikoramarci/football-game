import { GameContext } from "../../classes/game-context.interface";
import { Rule } from "../../classes/rule";
import { StandardPassActionMeta } from "../../metas/standard-pass.action-meta";

export class IsPassTargetHexClicked implements Rule {
    validate(context: GameContext): boolean {
        const actionMeta = context.actionMeta as StandardPassActionMeta;
        return !!actionMeta.availableTargets.getHex(context.hex) || false;
    }
    errorMessage = "not a target hex";
}