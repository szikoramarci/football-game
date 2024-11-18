import { StepContext } from "./step-context.interface";
import { StepRuleSet } from "./step-rule.interface";

export interface Step {
    ruleSet: StepRuleSet;
    identify(context: StepContext): boolean;
    calculation(context: StepContext): void;
    updateState(context: StepContext): void;
}
  