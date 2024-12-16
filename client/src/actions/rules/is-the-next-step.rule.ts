import { Type } from "@angular/core";
import { Rule } from "../classes/step-rule.interface";
import { Step } from "../classes/step.class";
import { GameContext } from "../classes/game-context.interface";

export class IsTheNextStep implements Rule {
    actionStepToCheck: Type<Step>;

    constructor(actionStepToCheck: Type<Step>) {
        this.actionStepToCheck = actionStepToCheck;
    }

    validate(context: GameContext): boolean {
        return context.lastStepMeta?.availableNextSteps.includes(this.actionStepToCheck) || false;
    }
    errorMessage = "action to check is not in the next available action list";
}