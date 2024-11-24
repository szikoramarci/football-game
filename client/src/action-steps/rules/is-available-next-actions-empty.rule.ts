import { StepContext } from "../classes/step-context.interface";
import { StepRule } from "../classes/step-rule.interface";

export class AreAvailableNextStepsEmpty implements StepRule {
    validate(context: StepContext): boolean {
        return context.lastStepMeta == undefined || context.lastStepMeta.availableNextSteps.length == 0;
    }
    errorMessage = "availalbe next actions are not empty";
}