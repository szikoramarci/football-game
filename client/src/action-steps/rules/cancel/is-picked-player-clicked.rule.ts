import { equals } from "honeycomb-grid";
import { StepRule } from "../../classes/step-rule.interface";
import { InitMovingStepMeta } from "../../metas/moving/init-moving.step-meta";
import { StepContext } from "../../classes/step-context.interface";

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