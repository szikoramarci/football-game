import { equals } from "honeycomb-grid";
import { ActionContext } from "../../interfaces/action.context.interface";
import { ActionRule } from "../../interfaces/action.rule.interface";
import { InitMovingActionMeta } from "../../metas/init-moving.action.meta";

export class IsPickedPlayerClicked implements ActionRule {
    validate(context: ActionContext): boolean {
        const lastActionMeta = context.lastActionMeta as InitMovingActionMeta;
        if (lastActionMeta.playerCoordinates) {
            return equals(lastActionMeta.playerCoordinates, context.coordinates);
        }        

        return false;
    }
    errorMessage = "not selected player clicked";
}