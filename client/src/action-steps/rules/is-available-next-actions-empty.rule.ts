import { ActionContext } from "../classes/action-context.interface";
import { StepRule } from "../classes/step-rule.interface";

export class AreAvailableNextStepsEmpty implements StepRule {
    validate(context: ActionContext): boolean {
        return context.lastStepMeta == undefined || context.lastStepMeta.availableNextSteps.length == 0;
    }
    errorMessage = "availalbe next actions are not empty";
}