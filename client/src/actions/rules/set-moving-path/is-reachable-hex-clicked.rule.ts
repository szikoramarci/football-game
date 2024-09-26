import { ActionContext } from "../../interfaces/action.context.interface";
import { ActionRule } from "../../interfaces/action.rule.interface";
import { InitMovingActionMeta } from "../../metas/init-moving.action.meta";

export class IsReachableHexClicked implements ActionRule {
    validate(context: ActionContext): boolean {
        const lastActionMeta = context.lastActionMeta as InitMovingActionMeta;
        return !!lastActionMeta.reachableHexes.getHex(context.coordinates) || false;
    }
    errorMessage = "not a reachable hex";
}