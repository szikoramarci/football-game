import { ActionMeta } from "../../actions/interfaces/action.meta.interface";

export interface ActionState {
  actionMeta: ActionMeta | undefined,
  
}

export const initialState: ActionState = {
  actionMeta: undefined
};
