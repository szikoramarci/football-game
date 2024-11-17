import { equals } from "honeycomb-grid";
import { ActionStepContext } from "../../interfaces/action-step-context.interface";
import { ActionStepRule } from "../../interfaces/action-step-rule.interface";
import { InitMovingActionStepMeta } from "../../metas/moving/init-moving.action-step-meta";

export class IsPickedPlayerClicked implements ActionStepRule {
    validate(context: ActionStepContext): boolean {
        const lastActionMeta = context.lastActionStepMeta as InitMovingActionStepMeta;
        if (lastActionMeta.playerCoordinates) {
            return equals(lastActionMeta.playerCoordinates, context.coordinates);
        }        

        return false;
    }
    errorMessage = "not selected player clicked";
}