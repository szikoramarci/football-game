import { StepContext } from "../../interfaces/step-context.interface";
import { StepRule } from "../../interfaces/step-rule.interface";
import { InitMovingStepMeta } from "../../metas/moving/init-moving.step-meta";

export class IsReachableHexClicked implements StepRule {
    validate(context: StepContext): boolean {
        const lastStepMeta = context.lastStepMeta as InitMovingStepMeta;
        return !!lastStepMeta.reachableHexes.getHex(context.coordinates) || false;
    }
    errorMessage = "not a reachable hex";
}