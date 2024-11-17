import { equals } from "honeycomb-grid";
import { ActionStepContext } from "../../interfaces/action-step-context.interface";
import { ActionStepRule } from "../../interfaces/action-step-rule.interface";
import { SetMovingPathActionStepMeta } from "../../metas/moving/set-moving-path.action-step-meta";

export class IsMoveTargetHexClicked implements ActionStepRule {
    validate(context: ActionStepContext): boolean {
        const lastActionMeta = context.lastActionStepMeta as SetMovingPathActionStepMeta;
        return equals(lastActionMeta.targetHex, context.coordinates);
    }
    errorMessage = "not the target hex";
}