import { GameContext } from "../../classes/game-context.interface";
import { Rule } from "../../classes/rule";

export class IsPlayerSelected implements Rule {
    validate(context: GameContext): boolean {
        return !!context.player;
    }
    errorMessage = "pick a player";
}