import { Type } from "@angular/core";
import { ActionStrategy } from "./action.strategy.interface";
import { OffsetCoordinates } from "honeycomb-grid";

export interface ActionMeta {
    timestamp: Date,
    clickedCoordinates: OffsetCoordinates,
    availableNextActions: Type<ActionStrategy>[]
}