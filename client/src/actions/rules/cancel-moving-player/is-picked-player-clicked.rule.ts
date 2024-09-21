import { equals } from "honeycomb-grid";
import { ActionContext } from "../../interfaces/action.context.interface";
import { ActionRule } from "../../interfaces/action.rule.interface";
import { PickUpPlayerActionMeta } from "../../metas/pick-up-player.action.meta";

export class IsPickedPlayerClicked implements ActionRule {
    validate(context: ActionContext): boolean {
        const lastActionMeta = context.lastActionMeta as PickUpPlayerActionMeta;
        return equals(lastActionMeta.playerCoordinates, context.coordinates);
    }
    errorMessage = "not selected player clicked";
}