import { equals } from "honeycomb-grid";
import { GameContext } from "../../classes/game-context.interface";
import { Rule } from "../../classes/step-rule.interface";
import { SetMovingPathStepMeta } from "../../metas/moving/set-moving-path.step-meta";

export class IsTargetHexNotThePlayerHex implements Rule {
    validate(context: GameContext): boolean {
        const lastStepMeta = context.lastStepMeta as SetMovingPathStepMeta;
        return !equals(lastStepMeta.targetHex, lastStepMeta.playerHex);
    }
    errorMessage = "target and player coordinates are the same";
}