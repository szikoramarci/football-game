import { Type } from "@angular/core";
import { Step } from "./step.interface";
import { OffsetCoordinates } from "honeycomb-grid";

export interface StepMeta {
    timestamp: Date,
    stepType: Type<Step>,
    clickedCoordinates: OffsetCoordinates,
    availableNextSteps: Type<Step>[]
}