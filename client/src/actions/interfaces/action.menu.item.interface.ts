import { Type } from "@angular/core";
import { ActionStrategy } from "./action.strategy.interface";

export interface ActionMenuItem {
    label: string,
    available?: boolean,
    relatedAction: Type<ActionStrategy>
}