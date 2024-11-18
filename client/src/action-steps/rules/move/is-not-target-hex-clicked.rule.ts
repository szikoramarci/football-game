import { equals } from "honeycomb-grid";
import { StepContext } from "../../interfaces/step-context.interface";
import { StepRule } from "../../interfaces/step-rule.interface";
import { SetMovingPathStepMeta } from "../../metas/moving/set-moving-path.step-meta";

export class IsNotTargetHexClicked implements StepRule {
    validate(context: StepContext): boolean {
        const lastStepMeta = context.lastStepMeta as SetMovingPathStepMeta;
        return this.isTargetHexNotSet(lastStepMeta) || !this.isTargetHexClicked(lastStepMeta, context)
    }
    errorMessage = "already selected hex as target";

    isTargetHexNotSet(lastStepMeta: SetMovingPathStepMeta) {
        return lastStepMeta.targetHex == undefined
    }

    isTargetHexClicked(lastStepMeta: SetMovingPathStepMeta, context: StepContext) {
        return equals(lastStepMeta.targetHex, context.coordinates);
    }
}