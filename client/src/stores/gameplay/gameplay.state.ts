import { Team } from "../../models/team.enum";

export interface GameplayState {
  attackingTeam: Team
}

export const initialState: GameplayState = {
  attackingTeam: Team.TEAM_A
};
