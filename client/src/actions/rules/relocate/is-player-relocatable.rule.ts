import { GameContext } from "../../classes/game-context.interface";
import { Rule } from "../../classes/rule";

export class IsPlayerRelocatable implements Rule {
    validate(context: GameContext): boolean {
        return context.playerIsRelocatable
                
    }
    errorMessage = "not relocatable";
}