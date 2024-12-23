import { GameContext } from "../../classes/game-context.interface";
import { Rule } from "../../classes/rule";
import { MovingActionMeta } from "../../metas/moving.action-meta";

export class IsMovingPathNotComplete implements Rule {
    validate(context: GameContext): boolean {
        const actionMeta = context.actionMeta as MovingActionMeta;
        const playerSpeed = actionMeta.player?.speed || 0;      
        return playerSpeed != actionMeta.possibleMovingPath!.toArray().length - 1;
    }
    errorMessage = "not a reachable hex";
}