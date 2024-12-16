import { Hex } from "honeycomb-grid"
import { MouseTriggerEventType } from "../../services/mouse-event/mouse-event.interface"

export interface BaseContext {
    mouseEventType: MouseTriggerEventType | undefined,
    hex: Hex,
}