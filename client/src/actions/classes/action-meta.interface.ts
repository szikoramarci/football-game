import { Type } from "@angular/core";
import { Step } from "./step.class";
import { Hex } from "honeycomb-grid";

export interface ActionMeta {
    playerHex: Hex
    clickedHex: Hex,
    availableNextSteps: Type<Step>[]
}

export function IsActionMeta(obj: any): boolean {
    return (
        typeof obj === 'object' &&
        obj !== null
      );
}