import { StepContext } from "../interfaces/step-context.interface";
import { StepRule } from "../interfaces/step-rule.interface";

export class AllOfThemRule implements StepRule {
    rules: StepRule[] = [];

    constructor(...rules: StepRule[]) {
        this.rules = rules;
    }

    validate(context: StepContext): boolean {
        return this.rules.every(rule => rule.validate(context));
    }
    errorMessage = "one of the rules was incorrect";
}