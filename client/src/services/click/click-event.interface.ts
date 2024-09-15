import { Hex, HexCoordinates, OffsetCoordinates } from "honeycomb-grid";

export interface ClickEvent {
    type: ClickEventType,
    coordinates: OffsetCoordinates
}

export enum ClickEventType {
    LEFT_CLICK = 0,
    SCROLL_CLICK = 1,
    RIGHT_CLICK = 2
}