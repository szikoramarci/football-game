import { GameContext } from "../../classes/game-context.interface";
import { Rule } from "../../classes/rule";
import { InitPassingStepMeta } from "../../metas/passing/init-passing.step-meta";

export class IsPassTargetHexClicked implements Rule {
    validate(context: GameContext): boolean {
        const lastStepMeta = context.lastStepMeta as InitPassingStepMeta;
        return !!lastStepMeta.availableTargets.getHex(context.hex) || false;
    }
    errorMessage = "not a target hex";
}