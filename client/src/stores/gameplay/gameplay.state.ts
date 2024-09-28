import { ActionMeta } from "../../actions/interfaces/action.meta.interface";

export interface GameplayState {
  activeTeam: string
}

export const initialState: GameplayState = {
  activeTeam: 'barca'
};
