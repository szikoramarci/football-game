import { ActionStepContext } from "../interfaces/action-step-context.interface";
import { ActionStepRule } from "../interfaces/action-step-rule.interface";

export class IsAvailableNextActionsEmpty implements ActionStepRule {
    validate(context: ActionStepContext): boolean {
        return context.lastActionStepMeta == undefined || context.lastActionStepMeta.availableNextActionSteps.length == 0;
    }
    errorMessage = "availalbe next actions are not empty";
}