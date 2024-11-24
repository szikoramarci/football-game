import { Type } from "@angular/core";
import { StepRule } from "../classes/step-rule.interface";
import { Step } from "../classes/step.class";
import { StepContext } from "../classes/step-context.interface";

export class IsTheNextStep implements StepRule {
    actionStepToCheck: Type<Step>;

    constructor(actionStepToCheck: Type<Step>) {
        this.actionStepToCheck = actionStepToCheck;
    }

    validate(context: StepContext): boolean {
        return context.lastStepMeta?.availableNextSteps.includes(this.actionStepToCheck) || false;
    }
    errorMessage = "action to check is not in the next available action list";
}