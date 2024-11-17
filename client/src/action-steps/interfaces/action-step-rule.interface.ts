import { ActionStepContext } from "./action-step-context.interface";

export interface ActionStepRule {
    validate(context: ActionStepContext): boolean;
    errorMessage: string;
}

export class ActionStepRuleSet {
    private rules: ActionStepRule[] = [];
  
    addRule(rule: ActionStepRule): void {
      this.rules.push(rule);
    }
  
    validate(context: ActionStepContext): boolean {
      return this.rules.every(rule => rule.validate(context));
    }
  }