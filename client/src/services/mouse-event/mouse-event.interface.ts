import { OffsetCoordinates } from "honeycomb-grid";
import { Point } from "pixi.js";

export interface MouseTriggerEvent {
    type: MouseTriggerEventType,
    coordinates: OffsetCoordinates,
    position: Point
}

export enum MouseTriggerEventType {
    LEFT_CLICK = 'click',
    RIGHT_CLICK = 'contextmenu',
    MOUSE_MOVE = 'mousemove'
}