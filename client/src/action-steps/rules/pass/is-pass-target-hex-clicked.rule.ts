import { StepContext } from "../../../action-steps/classes/step-context.interface";
import { StepRule } from "../../classes/step-rule.interface";
import { InitPassingStepMeta } from "../../metas/passing/init-passing.step-meta";

export class IsPassTargetHexClicked implements StepRule {
    validate(context: StepContext): boolean {
        const lastStepMeta = context.lastStepMeta as InitPassingStepMeta;
        return !!lastStepMeta.availableTargets.getHex(context.coordinates) || false;
    }
    errorMessage = "not a target hex";
}