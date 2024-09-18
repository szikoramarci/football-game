import { ActionStrategy } from "./action.strategy.interface";

export interface ActionMeta {
    timestamp: Date,
    availableNextActions: Array<new () => ActionStrategy>;
}