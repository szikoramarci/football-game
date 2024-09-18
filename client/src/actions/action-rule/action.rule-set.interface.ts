import { ActionContext } from "../action-context/action.context.interface";
import { ActionRule } from "./action.rule.interface";

export class RuleSet {
    private rules: ActionRule[] = [];
  
    addRule(rule: ActionRule): void {
      this.rules.push(rule);
    }
  
    validate(context: ActionContext): boolean {
      return this.rules.every(rule => rule.validate(context));
    }
  }