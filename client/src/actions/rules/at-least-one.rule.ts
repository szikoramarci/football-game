
import { GameContext } from "../classes/game-context.interface";
import { Rule } from "../classes/step-rule.interface";

export class AtLeastOneRule implements Rule {
    rules: Rule[] = [];

    constructor(...rules: Rule[]) {
        this.rules = rules;
    }

    validate(context: GameContext): boolean {
        return this.rules.some(rule => rule.validate(context));
    }
    errorMessage = "none of the rules was correct";
}