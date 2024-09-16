import { Action } from "../../actions/action.interface";

export interface ActionState {
  currentAction: Action | null
}

export const initialState: ActionState = {
  currentAction: null
};
