import { Type } from "@angular/core";
import { ActionMeta } from "./action.meta.interface";
import { ActionStrategy } from "./action.strategy.interface";

export interface ActionMenuItem {
    label: string,
    relatedActions: Type<ActionStrategy>[]
}