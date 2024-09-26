import { Type } from "@angular/core";
import { ActionStrategy } from "./action.strategy.interface";
import { OffsetCoordinates } from "honeycomb-grid";

export interface ActionMeta {
    timestamp: Date,
    actionType: Type<ActionStrategy>,
    clickedCoordinates: OffsetCoordinates,
    availableNextActions: Type<ActionStrategy>[]
}