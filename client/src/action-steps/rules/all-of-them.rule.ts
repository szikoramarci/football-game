import { ActionStepContext } from "../interfaces/action-step-context.interface";
import { ActionStepRule } from "../interfaces/action-step-rule.interface";

export class AllOfThemRule implements ActionStepRule {
    rules: ActionStepRule[] = [];

    constructor(...rules: ActionStepRule[]) {
        this.rules = rules;
    }

    validate(context: ActionStepContext): boolean {
        return this.rules.every(rule => rule.validate(context));
    }
    errorMessage = "one of the rules was incorrect";
}