import { GameContext } from "../../classes/game-context.interface";
import { Rule } from "../../classes/rule";

export class IsRelocatable implements Rule {
    validate(context: GameContext): boolean {
        if (context.player === undefined) return false
        return context.selectablePlayers.has(context.player.id)
                
    }
    errorMessage = "not relocatable";
}