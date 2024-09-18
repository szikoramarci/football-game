import { ActionContext } from "../action-context/action.context.interface";

export interface ActionStrategy {
    ruleSet: RuleSet;
    identify(context: ActionContext): boolean;
    calculation(context: ActionContext): void;
    triggerVisual(context: ActionContext): void;
    updateState(context: ActionContext): void;
}
  