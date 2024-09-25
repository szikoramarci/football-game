import { Type } from "@angular/core";
import { ActionMeta } from "../../actions/interfaces/action.meta.interface";
import { ActionStrategy } from "../../actions/interfaces/action.strategy.interface";

export interface ActionState {
  lastActionMeta: ActionMeta | undefined,
  actionMode: Type<ActionStrategy> | undefined
}

export const initialState: ActionState = {
  lastActionMeta: undefined,
  actionMode: undefined
};
