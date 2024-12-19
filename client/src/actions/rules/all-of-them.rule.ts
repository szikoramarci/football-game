import { GameContext } from "../classes/game-context.interface";
import { Rule } from "../classes/rule";

export class AllOfThemRule implements Rule {
    rules: Rule[] = [];

    constructor(...rules: Rule[]) {
        this.rules = rules;
    }

    validate(context: GameContext): boolean {
        return this.rules.every(rule => rule.validate(context));
    }
    errorMessage = "one of the rules was incorrect";
}