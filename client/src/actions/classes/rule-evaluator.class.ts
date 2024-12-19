import { GameContext } from "./game-context.interface";
import { Rule, RuleSet } from "./rule";

export abstract class RuleEvaluator {
    private ruleSet: RuleSet = new RuleSet();

    constructor() {
        this.initRuleSet()
    }

    protected addRule(rule: Rule) {
        this.ruleSet.addRule(rule)
    }

    identify(context: GameContext): boolean {
        return this.ruleSet.validate(context);
    }

    abstract initRuleSet(): void;

}