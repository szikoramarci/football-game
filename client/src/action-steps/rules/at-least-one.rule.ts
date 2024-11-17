import { ActionStepContext } from "../interfaces/action-step-context.interface";
import { ActionStepRule } from "../interfaces/action-step-rule.interface";

export class AtLeastOneRule implements ActionStepRule {
    rules: ActionStepRule[] = [];

    constructor(...rules: ActionStepRule[]) {
        this.rules = rules;
    }

    validate(context: ActionStepContext): boolean {
        return this.rules.some(rule => rule.validate(context));
    }
    errorMessage = "none of the rules was correct";
}