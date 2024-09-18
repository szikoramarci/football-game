import { ActionContext } from "../interfaces/action.context.interface";
import { ActionRuleSet } from "./action.rule.interface";

export interface ActionStrategy {
    ruleSet: ActionRuleSet;
    identify(context: ActionContext): boolean;
    calculation(context: ActionContext): void;
    triggerVisual(context: ActionContext): void;
    updateState(context: ActionContext): void;
}
  