import { StepContext } from "../../classes/step-context.class";
import { StepRule } from "../../classes/step-rule.interface";
import { InitMovingStepMeta } from "../../metas/moving/init-moving.step-meta";

export class IsReachableHexClicked implements StepRule {
    validate(context: StepContext): boolean {
        const lastStepMeta = context.lastStepMeta as InitMovingStepMeta;
        return !!lastStepMeta.reachableHexes.getHex(context.coordinates) || false;
    }
    errorMessage = "not a reachable hex";
}