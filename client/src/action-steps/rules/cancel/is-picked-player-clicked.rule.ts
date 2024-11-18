import { equals } from "honeycomb-grid";
import { StepContext } from "../../interfaces/step-context.interface";
import { StepRule } from "../../interfaces/step-rule.interface";
import { InitMovingStepMeta } from "../../metas/moving/init-moving.step-meta";

export class IsPickedPlayerClicked implements StepRule {
    validate(context: StepContext): boolean {
        const lastStepMeta = context.lastStepMeta as InitMovingStepMeta;
        if (lastStepMeta.playerCoordinates) {
            return equals(lastStepMeta.playerCoordinates, context.coordinates);
        }        

        return false;
    }
    errorMessage = "not selected player clicked";
}