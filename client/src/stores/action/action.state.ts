import { ActionMeta } from "../../actions/interfaces/action.meta.interface";

export interface ActionState {
  lastActionMeta: ActionMeta | undefined,
}

export const initialState: ActionState = {
  lastActionMeta: undefined
};
