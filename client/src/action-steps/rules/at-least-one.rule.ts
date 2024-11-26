
import { StepContext } from "../classes/step-context.interface";
import { StepRule } from "../classes/step-rule.interface";

export class AtLeastOneRule implements StepRule {
    rules: StepRule[] = [];

    constructor(...rules: StepRule[]) {
        this.rules = rules;
    }

    validate(context: StepContext): boolean {
        return this.rules.some(rule => rule.validate(context));
    }
    errorMessage = "none of the rules was correct";
}