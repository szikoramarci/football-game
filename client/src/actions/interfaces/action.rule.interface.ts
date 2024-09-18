import { ActionContext } from "../interfaces/action.context.interface";

export interface ActionRule {
    validate(context: ActionContext): boolean;
    errorMessage: string;
}

export class ActionRuleSet {
    private rules: ActionRule[] = [];
  
    addRule(rule: ActionRule): void {
      this.rules.push(rule);
    }
  
    validate(context: ActionContext): boolean {
      return this.rules.every(rule => rule.validate(context));
    }
  }