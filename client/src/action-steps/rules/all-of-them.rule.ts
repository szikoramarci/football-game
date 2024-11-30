import { ActionContext } from "../classes/action-context.interface";
import { StepRule } from "../classes/step-rule.interface";

export class AllOfThemRule implements StepRule {
    rules: StepRule[] = [];

    constructor(...rules: StepRule[]) {
        this.rules = rules;
    }

    validate(context: ActionContext): boolean {
        return this.rules.every(rule => rule.validate(context));
    }
    errorMessage = "one of the rules was incorrect";
}