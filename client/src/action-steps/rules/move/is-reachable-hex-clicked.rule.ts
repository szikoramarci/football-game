import { ActionStepContext } from "../../interfaces/action-step-context.interface";
import { ActionStepRule } from "../../interfaces/action-step-rule.interface";
import { InitMovingActionStepMeta } from "../../metas/moving/init-moving.action-step-meta";

export class IsReachableHexClicked implements ActionStepRule {
    validate(context: ActionStepContext): boolean {
        const lastActionMeta = context.lastActionStepMeta as InitMovingActionStepMeta;
        return !!lastActionMeta.reachableHexes.getHex(context.coordinates) || false;
    }
    errorMessage = "not a reachable hex";
}