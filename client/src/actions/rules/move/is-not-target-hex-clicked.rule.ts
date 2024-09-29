import { equals } from "honeycomb-grid";
import { ActionContext } from "../../interfaces/action.context.interface";
import { ActionRule } from "../../interfaces/action.rule.interface";
import { SetMovingPathActionMeta } from "../../metas/set-moving-path.action.meta";

export class IsNotTargetHexClicked implements ActionRule {
    validate(context: ActionContext): boolean {
        const lastActionMeta = context.lastActionMeta as SetMovingPathActionMeta;
        return this.isTargetHexNotSet(lastActionMeta) || !this.isTargetHexClicked(lastActionMeta, context)
    }
    errorMessage = "already selected hex as target";

    isTargetHexNotSet(lastActionMeta: SetMovingPathActionMeta) {
        return lastActionMeta.targetHex == undefined
    }

    isTargetHexClicked(lastActionMeta: SetMovingPathActionMeta, context: ActionContext) {
        return equals(lastActionMeta.targetHex, context.coordinates);
    }
}