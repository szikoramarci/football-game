import { GameContext } from "../classes/game-context.interface";
import { Rule } from "../classes/rule";

export class RelocationIsInactive implements Rule {
    validate(context: GameContext): boolean {
        return context.relocationTurns.length == 0
    }
    errorMessage = "relocation is active";
}