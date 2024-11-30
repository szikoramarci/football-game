import { ActionContext } from "./action-context.interface";

export interface StepRule {
    validate(context: ActionContext): boolean;
    errorMessage: string;
}

export class StepRuleSet {
    private rules: StepRule[] = [];
  
    addRule(rule: StepRule): void {
      this.rules.push(rule);
    }
  
    validate(context: ActionContext): boolean {
      return this.rules.every(rule => rule.validate(context));
    }
  }