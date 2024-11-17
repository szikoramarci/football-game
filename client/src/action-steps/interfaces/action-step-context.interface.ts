import { OffsetCoordinates } from "honeycomb-grid";
import { Player } from "../../models/player.model";
import { ActionStepMeta } from "./action-step-meta.interface";
import { MouseTriggerEventType } from "../../services/mouse-event/mouse-event.interface";
import { Point } from "pixi.js";

export interface ActionStepContext {
    mouseEventType: MouseTriggerEventType | undefined,
    coordinates: OffsetCoordinates,
    mousePosition: Point
    player: Player | undefined,    
    playerHasBall: boolean,
    lastActionStepMeta: ActionStepMeta | undefined
    activeTeam: string
}