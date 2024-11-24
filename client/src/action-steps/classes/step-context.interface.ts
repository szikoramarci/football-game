import { Hex } from "honeycomb-grid";
import { Player } from "../../models/player.model";
import { StepMeta } from "./step-meta.interface";
import { BaseContext } from "./base-context.interface";

export interface StepContext extends BaseContext {
    player: Player | undefined,    
    hex: Hex | undefined,
    playerHasBall: boolean,
    lastStepMeta: StepMeta | undefined
    activeTeam: string
}