import { Action } from "../../actions/action.interface";

export interface ActionState {
  lastAction: Action | null,
  
}

export const initialState: ActionState = {
  currentAction: null
};
