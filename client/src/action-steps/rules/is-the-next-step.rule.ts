import { Type } from "@angular/core";
import { StepContext } from "../interfaces/step-context.interface";
import { StepRule } from "../interfaces/step-rule.interface";
import { Step } from "../interfaces/step.interface";

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