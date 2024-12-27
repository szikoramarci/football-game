import { GameContext } from "../../classes/game-context.interface";
import { Rule } from "../../classes/rule";

export class IsPlayerMovable implements Rule {
    validate(context: GameContext): boolean {
        return context.playerIsMovable
                
    }
    errorMessage = "not relocatable";
}