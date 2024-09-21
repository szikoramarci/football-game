import { equals, OffsetCoordinates } from "honeycomb-grid";

export interface MouseTriggerEvent {
    type: MouseTriggerEventType,
    coordinates: OffsetCoordinates
}

export enum MouseTriggerEventType {
    LEFT_CLICK = 'click',
    RIGHT_CLICK = 'contextmenu',
    MOUSE_MOVE = 'mousemove'
}

export function isMouseTriggerEventsEqual(a: MouseTriggerEvent, b: MouseTriggerEvent) {
    return a.type == b.type && equals(a.coordinates, b.coordinates);
}