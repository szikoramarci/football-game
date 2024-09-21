import { ActionContext } from "../interfaces/action.context.interface";
import { ActionRule } from "../interfaces/action.rule.interface";

export class AtLeastOneRule implements ActionRule {
    rules: ActionRule[] = [];

    constructor(...rules: ActionRule[]) {
        this.rules = rules;
    }

    validate(context: ActionContext): boolean {
        return this.rules.some(rule => rule.validate(context));
    }
    errorMessage = "none of the rules was correct";
}