import { ActionContext } from "../interfaces/action.context.interface";
import { ActionRule } from "../interfaces/action.rule.interface";

export class AllOfThemRule implements ActionRule {
    rules: ActionRule[] = [];

    constructor(...rules: ActionRule[]) {
        this.rules = rules;
    }

    validate(context: ActionContext): boolean {
        return this.rules.every(rule => rule.validate(context));
    }
    errorMessage = "one of the rules was incorrect";
}