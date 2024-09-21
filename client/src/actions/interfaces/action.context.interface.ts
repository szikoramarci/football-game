import { OffsetCoordinates } from "honeycomb-grid";
import { Player } from "../../models/player.model";
import { ActionMeta } from "./action.meta.interface";
import { ClickEventType } from "../../services/click/click-event.interface";

export interface ActionContext {
    clickEventType: ClickEventType,
    coordinates: OffsetCoordinates,
    player: Player | undefined,    
    lastActionMeta: ActionMeta | undefined
}