import { StepMeta } from "../../action-steps/classes/step-meta.interface";
import { Action } from "../../actions/action.interface";

export interface ActionState {
  lastStepMeta: StepMeta | undefined,
  currentAction: Action | undefined,
  currentStepIndex: number,
  availableActions: Action[]
}

export const initialState: ActionState = {
  lastStepMeta: undefined,
  currentAction: undefined,
  currentStepIndex: 0,
  availableActions: []
};
