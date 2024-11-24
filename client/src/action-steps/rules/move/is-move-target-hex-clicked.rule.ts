import { equals } from "honeycomb-grid";
import { StepContext } from "../../../action-steps/classes/step-context.interface";
import { StepRule } from "../../classes/step-rule.interface";
import { SetMovingPathStepMeta } from "../../metas/moving/set-moving-path.step-meta";

export class IsMoveTargetHexClicked implements StepRule {
    validate(context: StepContext): boolean {
        const lastStepMeta = context.lastStepMeta as SetMovingPathStepMeta;
        return equals(lastStepMeta.targetHex, context.coordinates);
    }
    errorMessage = "not the target hex";
}