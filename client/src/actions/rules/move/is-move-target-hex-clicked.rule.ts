import { equals } from "honeycomb-grid";
import { GameContext } from "../../classes/game-context.interface";
import { Rule } from "../../classes/rule";
import { SetMovingPathStepMeta } from "../../metas/moving/set-moving-path.step-meta";

export class IsMoveTargetHexClicked implements Rule {
    validate(context: GameContext): boolean {
        const lastStepMeta = context.lastStepMeta as SetMovingPathStepMeta;
        return equals(lastStepMeta.targetHex, context.hex);
    }
    errorMessage = "not the target hex";
}