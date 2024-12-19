import { equals } from "honeycomb-grid";
import { GameContext } from "../../classes/game-context.interface";
import { Rule } from "../../classes/rule";
import { SetMovingPathStepMeta } from "../../metas/moving/set-moving-path.step-meta";

export class IsNotTargetHexClicked implements Rule {
    validate(context: GameContext): boolean {
        const lastStepMeta = context.lastStepMeta as SetMovingPathStepMeta;
        return this.isTargetHexNotSet(lastStepMeta) || !this.isTargetHexClicked(lastStepMeta, context)
    }
    errorMessage = "already selected hex as target";

    isTargetHexNotSet(lastStepMeta: SetMovingPathStepMeta) {
        return lastStepMeta.targetHex == undefined
    }

    isTargetHexClicked(lastStepMeta: SetMovingPathStepMeta, context: GameContext) {
        return equals(lastStepMeta.targetHex, context.hex);
    }
}