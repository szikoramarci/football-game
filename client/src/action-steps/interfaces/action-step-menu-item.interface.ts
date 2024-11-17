import { Type } from "@angular/core";
import { ActionStepStrategy } from "./action-step-strategy.interface";

export interface ActionStepMenuItem {
    label: string,
    relatedActions: Type<ActionStepStrategy>[]
}