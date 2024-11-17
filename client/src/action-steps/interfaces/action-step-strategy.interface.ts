import { ActionStepContext } from "./action-step-context.interface";
import { ActionStepRuleSet } from "./action-step-rule.interface";

export interface ActionStepStrategy {
    ruleSet: ActionStepRuleSet;
    identify(context: ActionStepContext): boolean;
    calculation(context: ActionStepContext): void;
    updateState(context: ActionStepContext): void;
}
  