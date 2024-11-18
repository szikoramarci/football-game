import { Type } from "@angular/core";
import { Step } from "../action-steps/interfaces/step.interface";

export interface Action {
    steps: Type<Step>[]
}