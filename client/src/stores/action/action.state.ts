import { StepMeta } from "../../action-steps/classes/step-meta.interface";
import { Action } from "../../actions/action.interface";
import { highPassAction } from "../../actions/high-pass.action";
import { movingAction } from "../../actions/moving.action";
import { standardPassAction } from "../../actions/standard-pass.action";

export interface ActionState {
  lastStepMeta: StepMeta | undefined,
  lastAction: Action | undefined,
  availableActions: Action[]
}

export const initialState: ActionState = {
  lastStepMeta: undefined,
  lastAction: undefined,
  availableActions: [
    movingAction,
    standardPassAction,
    highPassAction,    
  ]
};
