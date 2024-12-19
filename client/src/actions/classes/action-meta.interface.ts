import { Type } from "@angular/core";
import { Step } from "./step.class";
import { Hex } from "honeycomb-grid";

export interface ActionMeta {
    clickedHex: Hex,
    availableNextSteps: Type<Step>[]
}