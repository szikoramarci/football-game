import { equals } from "honeycomb-grid";
import { ActionContext } from "../../classes/action-context.interface";
import { StepRule } from "../../classes/step-rule.interface";
import { SetMovingPathStepMeta } from "../../metas/moving/set-moving-path.step-meta";

export class IsMoveTargetHexClicked implements StepRule {
    validate(context: ActionContext): boolean {
        const lastStepMeta = context.lastStepMeta as SetMovingPathStepMeta;
        return equals(lastStepMeta.targetHex, context.coordinates);
    }
    errorMessage = "not the target hex";
}