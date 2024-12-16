import { Player } from "../../models/player.model";
import { StepMeta } from "./step-meta.interface";
import { BaseContext } from "./base-context.interface";
import { Type } from "@angular/core";
import { Action } from "./action.class";

export interface GameContext extends BaseContext {
    player: Player | undefined,   
    playerHasBall: boolean,
    lastStepMeta: StepMeta | undefined,
    availableActions: Type<Action>[],
    activeTeam: string
}