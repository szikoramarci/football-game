import { GameContext } from "../classes/game-context.interface";
import { Rule } from "../classes/rule";

export class AreAvailableNextStepsEmpty implements Rule {
    validate(context: GameContext): boolean {
        return context.lastStepMeta == undefined || context.lastStepMeta.availableNextSteps.length == 0;
    }
    errorMessage = "availalbe next actions are not empty";
}