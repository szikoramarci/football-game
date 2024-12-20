import { GameContext } from "../../classes/game-context.interface";
import { Rule } from "../../classes/rule";

export class IsRelocatable implements Rule {
    validate(context: GameContext): boolean {
        if (context.relocationTurns.length == 0) {
            return context.attackingTeam == context.player?.team
        }

        if (context.player?.id && context.usedPlayers.has(context.player.id)) return false

        const nextRelocationTurn = context.relocationTurns[0]
        if (nextRelocationTurn.team != context.player?.team) return false        

        return true
                
    }
    errorMessage = "not relocatable";
}