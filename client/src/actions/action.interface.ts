import { Type } from "@angular/core";
import { Step } from "../action-steps/classes/step.class";

export interface Action {
    steps: Type<Step>[]
}