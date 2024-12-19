import { equals } from "honeycomb-grid";
import { Rule } from "../../classes/rule";
import { MovingActionMeta } from "../../metas/moving.action-meta";
import { GameContext } from "../../classes/game-context.interface";

export class IsPickedPlayerClicked implements Rule {
    validate(context: GameContext): boolean {
        const lastStepMeta = context.actionMeta as MovingActionMeta;
        if (lastStepMeta.playerHex) {
            return equals(lastStepMeta.playerHex, context.hex);
        }        

        return false;
    }
    errorMessage = "not selected player clicked";
}