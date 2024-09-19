import { Type } from "@angular/core";
import { ActionStrategy } from "./action.strategy.interface";

export interface ActionMeta {
    timestamp: Date,
    availableNextActions: Type<ActionStrategy>[]
}