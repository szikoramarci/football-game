import { GameContext } from "../../classes/game-context.interface";
import { Rule } from "../../classes/rule";

export class IsOwnPlayer implements Rule {
    validate(context: GameContext): boolean {
        return context.player?.team == context.activeTeam || false;
    }
    errorMessage = "pick from your own players";
}