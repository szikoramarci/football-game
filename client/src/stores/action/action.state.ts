import { Type } from "@angular/core";
import { StepMeta } from "../../action-steps/classes/step-meta.interface";
import { Action } from "../../actions/action.interface";

export interface ActionState {
  lastStepMeta: StepMeta | undefined,
  availableActions: Type<Action>[]
}

export const initialState: ActionState = {
  lastStepMeta: undefined,
  availableActions: []
};
