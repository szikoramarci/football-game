
import { equals } from "honeycomb-grid";
import { GameContext } from "../../classes/game-context.interface";
import { Rule } from "../../classes/rule";
import { MovingActionMeta } from "../../metas/moving.action-meta";

export class IsLastPathPointClicked implements Rule {
    validate(context: GameContext): boolean {
        const actionMeta = context.actionMeta as MovingActionMeta;
        const lastPathPoint = actionMeta.pathPoints.at(-1) || null;
        return !!lastPathPoint && equals(lastPathPoint, context.hex);
    }
    errorMessage = "not a reachable hex";
}