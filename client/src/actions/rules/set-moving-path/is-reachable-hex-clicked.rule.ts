import { ActionContext } from "../../interfaces/action.context.interface";
import { ActionRule } from "../../interfaces/action.rule.interface";
import { PickUpPlayerActionMeta } from "../../metas/pick-up-player.action.meta";

export class IsReachableHexClicked implements ActionRule {
    validate(context: ActionContext): boolean {
        const lastActionMeta = context.lastActionMeta as PickUpPlayerActionMeta;
        return !!lastActionMeta.reachableHexes.getHex(context.coordinates) || false;
    }
    errorMessage = "not a reachable hex";
}