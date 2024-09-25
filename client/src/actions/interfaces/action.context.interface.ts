import { OffsetCoordinates } from "honeycomb-grid";
import { Player } from "../../models/player.model";
import { ActionMeta } from "./action.meta.interface";
import { MouseTriggerEventType } from "../../services/mouse-event/mouse-event.interface";

export interface ActionContext {
    mouseEventType: MouseTriggerEventType | undefined,
    coordinates: OffsetCoordinates,
    player: Player | undefined,    
    lastActionMeta: ActionMeta | undefined
}