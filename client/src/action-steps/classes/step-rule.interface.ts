import { StepContext } from "./step-context.interface";

export interface StepRule {
    validate(context: StepContext): boolean;
    errorMessage: string;
}

export class StepRuleSet {
    private rules: StepRule[] = [];
  
    addRule(rule: StepRule): void {
      this.rules.push(rule);
    }
  
    validate(context: StepContext): boolean {
      return this.rules.every(rule => rule.validate(context));
    }
  }