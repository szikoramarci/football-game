import { OffsetCoordinates } from "honeycomb-grid";
import { Player } from "../../models/player.model";
import { StepMeta } from "./step-meta.interface";
import { MouseTriggerEventType } from "../../services/mouse-event/mouse-event.interface";
import { Point } from "pixi.js";

export interface StepContext {
    mouseEventType: MouseTriggerEventType | undefined,
    coordinates: OffsetCoordinates,
    mousePosition: Point
    player: Player | undefined,    
    playerHasBall: boolean,
    lastStepMeta: StepMeta | undefined
    activeTeam: string
}