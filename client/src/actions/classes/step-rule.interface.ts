import { GameContext } from "./game-context.interface";

export interface Rule {
    validate(context: GameContext): boolean;
    errorMessage: string;
}

export class RuleSet {
    private rules: Rule[] = [];
  
    addRule(rule: Rule): void {
      this.rules.push(rule);
    }
  
    validate(context: GameContext): boolean {
      return this.rules.every(rule => rule.validate(context));
    }
  }