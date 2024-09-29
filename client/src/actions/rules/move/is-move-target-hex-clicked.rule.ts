import { equals } from "honeycomb-grid";
import { ActionContext } from "../../interfaces/action.context.interface";
import { ActionRule } from "../../interfaces/action.rule.interface";
import { SetMovingPathActionMeta } from "../../metas/set-moving-path.action.meta";

export class IsMoveTargetHexClicked implements ActionRule {
    validate(context: ActionContext): boolean {
        const lastActionMeta = context.lastActionMeta as SetMovingPathActionMeta;
        return equals(lastActionMeta.targetHex, context.coordinates);
    }
    errorMessage = "not the target hex";
}