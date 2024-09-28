import { ActionContext } from "../../interfaces/action.context.interface";
import { ActionRule } from "../../interfaces/action.rule.interface";
import { InitPassingActionMeta } from "../../metas/init-passing.action.meta";

export class IsPassTargetHexClicked implements ActionRule {
    validate(context: ActionContext): boolean {
        const lastActionMeta = context.lastActionMeta as InitPassingActionMeta;
        return !!lastActionMeta.availableTargets.getHex(context.coordinates) || false;
    }
    errorMessage = "not a target hex";
}