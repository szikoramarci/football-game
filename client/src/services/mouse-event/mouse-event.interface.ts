import { Hex } from "@szikoramarci/honeycomb-grid";

export interface MouseTriggerEvent {
    type: MouseTriggerEventType,
    hex: Hex
}

export enum MouseTriggerEventType {
    LEFT_CLICK = 'click',
    RIGHT_CLICK = 'contextmenu',
    MOUSE_MOVE = 'mousemove'
}