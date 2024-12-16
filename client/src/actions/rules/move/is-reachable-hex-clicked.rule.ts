import { StepContext } from "../../../actions/classes/step-context.class";
import { Rule } from "../../classes/step-rule.interface";
import { InitMovingStepMeta } from "../../metas/moving/init-moving.step-meta";

export class IsReachableHexClicked implements Rule {
    validate(context: StepContext): boolean {
        const lastStepMeta = context.lastStepMeta as InitMovingStepMeta;
        return !!lastStepMeta.reachableHexes.getHex(context.coordinates) || false;
    }
    errorMessage = "not a reachable hex";
}