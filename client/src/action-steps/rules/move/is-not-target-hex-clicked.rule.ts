import { equals } from "honeycomb-grid";
import { ActionContext } from "../../classes/action-context.interface";
import { StepRule } from "../../classes/step-rule.interface";
import { SetMovingPathStepMeta } from "../../metas/moving/set-moving-path.step-meta";

export class IsNotTargetHexClicked implements StepRule {
    validate(context: ActionContext): boolean {
        const lastStepMeta = context.lastStepMeta as SetMovingPathStepMeta;
        return this.isTargetHexNotSet(lastStepMeta) || !this.isTargetHexClicked(lastStepMeta, context)
    }
    errorMessage = "already selected hex as target";

    isTargetHexNotSet(lastStepMeta: SetMovingPathStepMeta) {
        return lastStepMeta.targetHex == undefined
    }

    isTargetHexClicked(lastStepMeta: SetMovingPathStepMeta, context: ActionContext) {
        return equals(lastStepMeta.targetHex, context.coordinates);
    }
}