import { Player } from "../../models/player.model";
import { ActionMeta } from "./action-meta.interface";
import { BaseContext } from "./base-context.interface";
import { Type } from "@angular/core";
import { Action } from "./action.class";
import { RelocationTurn } from "../../relocation/relocation-turn.interface";

export interface GameContext extends BaseContext {
    player: Player | undefined,   
    playerHasBall: boolean,
    actionMeta: ActionMeta | undefined,
    availableActions: Type<Action>[],
    attackingTeam: string,
    relocationTurns: RelocationTurn[]
    usedPlayers: Set<string>
}