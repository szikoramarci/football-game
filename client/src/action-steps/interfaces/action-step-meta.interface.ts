import { Type } from "@angular/core";
import { ActionStepStrategy } from "./action-step-strategy.interface";
import { OffsetCoordinates } from "honeycomb-grid";

export interface ActionStepMeta {
    timestamp: Date,
    actionType: Type<ActionStepStrategy>,
    clickedCoordinates: OffsetCoordinates,
    availableNextActionSteps: Type<ActionStepStrategy>[]
}