
import { GameContext } from "../../classes/game-context.interface";
import { Rule } from "../../classes/rule";
import { MovingActionMeta } from "../../metas/moving.action-meta";

export class IsReachableHexClicked implements Rule {
    validate(context: GameContext): boolean {
        const actionMeta = context.actionMeta as MovingActionMeta;
        return !!actionMeta.reachableHexes.getHex(context.hex) || false;
    }
    errorMessage = "not a reachable hex";
}