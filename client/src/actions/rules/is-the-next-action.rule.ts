import { Type } from "@angular/core";
import { ActionContext } from "../interfaces/action.context.interface";
import { ActionRule } from "../interfaces/action.rule.interface";
import { ActionStrategy } from "../interfaces/action.strategy.interface";

export class IsTheNextAction implements ActionRule {
    actionToCheck: Type<ActionStrategy>;

    constructor(actionToCheck: Type<ActionStrategy>) {
        this.actionToCheck = actionToCheck;
    }

    validate(context: ActionContext): boolean {
        return context.lastActionMeta?.availableNextActions.includes(this.actionToCheck) || false;
    }
    errorMessage = "action to check is not in the next available action list";
}