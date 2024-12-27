import { GameContext } from "../../classes/game-context.interface";
import { Rule } from "../../classes/rule";

export class CanPlayerTackle implements Rule {
    validate(context: GameContext): boolean {        
        return context.playerCanTackle || false
    }
    errorMessage = "player can't tackle";

}