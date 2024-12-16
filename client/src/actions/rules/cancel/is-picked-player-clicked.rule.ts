import { equals } from "honeycomb-grid";
import { Rule } from "../../classes/step-rule.interface";
import { InitMovingStepMeta } from "../../metas/moving/init-moving.step-meta";
import { GameContext } from "../../classes/game-context.interface";

export class IsPickedPlayerClicked implements Rule {
    validate(context: GameContext): boolean {
        const lastStepMeta = context.lastStepMeta as InitMovingStepMeta;
        if (lastStepMeta.playerHex) {
            return equals(lastStepMeta.playerHex, context.hex);
        }        

        return false;
    }
    errorMessage = "not selected player clicked";
}