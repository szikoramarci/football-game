import { GameContext } from "../../classes/game-context.interface";
import { Rule } from "../../classes/rule";

export class HasThePlayerTheBall implements Rule {
    validate(context: GameContext): boolean {
        return !!context.playerHasBall;
    }
    errorMessage = "pick a player with ball";
}