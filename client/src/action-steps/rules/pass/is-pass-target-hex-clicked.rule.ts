import { ActionStepContext } from "../../interfaces/action-step-context.interface";
import { ActionStepRule } from "../../interfaces/action-step-rule.interface";
import { InitPassingActionStepMeta } from "../../metas/passing/init-passing.action-step-meta";

export class IsPassTargetHexClicked implements ActionStepRule {
    validate(context: ActionStepContext): boolean {
        const lastActionMeta = context.lastActionStepMeta as InitPassingActionStepMeta;
        return !!lastActionMeta.availableTargets.getHex(context.coordinates) || false;
    }
    errorMessage = "not a target hex";
}