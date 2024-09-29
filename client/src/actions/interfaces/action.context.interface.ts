import { OffsetCoordinates } from "honeycomb-grid";
import { Player } from "../../models/player.model";
import { ActionMeta } from "./action.meta.interface";
import { MouseTriggerEventType } from "../../services/mouse-event/mouse-event.interface";
import { Point } from "pixi.js";

export interface ActionContext {
    mouseEventType: MouseTriggerEventType | undefined,
    coordinates: OffsetCoordinates,
    mousePosition: Point
    player: Player | undefined,    
    playerHasBall: boolean,
    lastActionMeta: ActionMeta | undefined
    activeTeam: string
}