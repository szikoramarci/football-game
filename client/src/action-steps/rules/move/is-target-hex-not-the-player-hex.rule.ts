import { equals } from "honeycomb-grid";
import { StepContext } from "../../interfaces/step-context.interface";
import { StepRule } from "../../interfaces/step-rule.interface";
import { SetMovingPathStepMeta } from "../../metas/moving/set-moving-path.step-meta";

export class IsTargetHexNotThePlayerHex implements StepRule {
    validate(context: StepContext): boolean {
        const lastStepMeta = context.lastStepMeta as SetMovingPathStepMeta;
        return !equals(lastStepMeta.targetHex, lastStepMeta.playerCoordinates);
    }
    errorMessage = "target and player coordinates are the same";
}