import { equals } from "honeycomb-grid";
import { ActionStepContext } from "../../interfaces/action-step-context.interface";
import { ActionStepRule } from "../../interfaces/action-step-rule.interface";
import { SetMovingPathActionStepMeta } from "../../metas/moving/set-moving-path.action-step-meta";

export class IsNotTargetHexClicked implements ActionStepRule {
    validate(context: ActionStepContext): boolean {
        const lastActionMeta = context.lastActionStepMeta as SetMovingPathActionStepMeta;
        return this.isTargetHexNotSet(lastActionMeta) || !this.isTargetHexClicked(lastActionMeta, context)
    }
    errorMessage = "already selected hex as target";

    isTargetHexNotSet(lastActionMeta: SetMovingPathActionStepMeta) {
        return lastActionMeta.targetHex == undefined
    }

    isTargetHexClicked(lastActionMeta: SetMovingPathActionStepMeta, context: ActionStepContext) {
        return equals(lastActionMeta.targetHex, context.coordinates);
    }
}