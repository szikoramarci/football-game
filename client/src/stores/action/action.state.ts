import { ActionStepMeta } from "../../action-steps/interfaces/action-step-meta.interface";

export interface ActionState {
  lastActionMeta: ActionStepMeta | undefined
}

export const initialState: ActionState = {
  lastActionMeta: undefined
};
