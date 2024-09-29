import { equals } from "honeycomb-grid";
import { ActionContext } from "../../interfaces/action.context.interface";
import { ActionRule } from "../../interfaces/action.rule.interface";
import { SetMovingPathActionMeta } from "../../metas/set-moving-path.action.meta";

export class IsTargetHexNotThePlayerHex implements ActionRule {
    validate(context: ActionContext): boolean {
        const lastActionMeta = context.lastActionMeta as SetMovingPathActionMeta;
        return !equals(lastActionMeta.targetHex, lastActionMeta.playerCoordinates);
    }
    errorMessage = "target and player coordinates are the same";
}