import { GameContext } from "../../classes/game-context.interface";
import { Rule } from "../../classes/step-rule.interface";

export class IsPlayerSelected implements Rule {
    validate(context: GameContext): boolean {
        return !!context.player;
    }
    errorMessage = "pick a player";
}