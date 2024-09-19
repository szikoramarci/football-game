import { OffsetCoordinates } from "honeycomb-grid";
import { Player } from "../../models/player.model";
import { ActionMeta } from "./action.meta.interface";

export interface ActionContext {
    coordinates: OffsetCoordinates,
    player: Player | undefined,    
    lastActionMeta: ActionMeta | undefined
}