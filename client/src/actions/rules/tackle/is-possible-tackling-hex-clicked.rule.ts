
import { GameContext } from "../../classes/game-context.interface";
import { Rule } from "../../classes/rule";
import { TacklingActionMeta } from "../../metas/tackling.action-meta";

export class IsPossibleTacklingHexClicked implements Rule {
    validate(context: GameContext): boolean {
        const actionMeta = context.actionMeta as TacklingActionMeta;
        return !!actionMeta.possibleTacklingHexes.getHex(context.hex) || false;
    }
    errorMessage = "not a reachable hex";
}