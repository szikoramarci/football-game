import { equals } from "honeycomb-grid";
import { GameContext } from "../../classes/game-context.interface";
import { Rule } from "../../classes/rule";
import { MovingActionMeta } from "../../metas/moving.action-meta";

export class IsTargetHexNotThePlayerHex implements Rule {
    validate(context: GameContext): boolean {
        const actionMeta = context.actionMeta as MovingActionMeta;
        return !equals(actionMeta.targetHex!, actionMeta.playerHex);
    }
    errorMessage = "target and player coordinates are the same";
}