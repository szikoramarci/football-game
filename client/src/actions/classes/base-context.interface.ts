import { Hex } from "@szikoramarci/honeycomb-grid"
import { MouseTriggerEventType } from "../../services/mouse-event/mouse-event.interface"

export interface BaseContext {
    mouseEventType: MouseTriggerEventType | undefined,
    hex: Hex,
}