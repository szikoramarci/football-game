import { Type } from "@angular/core";
import { Step } from "./step.class";
import { OffsetCoordinates } from "honeycomb-grid";

export interface StepMeta {
    clickedCoordinates: OffsetCoordinates,
    availableNextSteps: Type<Step>[]
}