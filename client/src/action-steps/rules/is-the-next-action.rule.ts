import { Type } from "@angular/core";
import { ActionStepContext } from "../interfaces/action-step-context.interface";
import { ActionStepRule } from "../interfaces/action-step-rule.interface";
import { ActionStepStrategy } from "../interfaces/action-step-strategy.interface";

export class IsTheNextActionStep implements ActionStepRule {
    actionStepToCheck: Type<ActionStepStrategy>;

    constructor(actionStepToCheck: Type<ActionStepStrategy>) {
        this.actionStepToCheck = actionStepToCheck;
    }

    validate(context: ActionStepContext): boolean {
        return context.lastActionStepMeta?.availableNextActionSteps.includes(this.actionStepToCheck) || false;
    }
    errorMessage = "action to check is not in the next available action list";
}