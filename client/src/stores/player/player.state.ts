import { Player } from "../../models/player.model";
import { Team } from "../../models/team.enum";

export interface PlayerState {
  [playerID: string]: Player 
}

export const initialState: PlayerState = {
  "messi": new Player("messi","Messi", "10", Team.TEAM_A, 6, 6, 2),
  "suarez": new Player("suarez","Suarez", "9", Team.TEAM_A, 5, 4, 2),
  "busquets": new Player("busquets","Busquets", "5", Team.TEAM_A, 4, 4, 4),
  "piqué": new Player("piqué","Piqué", "3", Team.TEAM_A, 4, 2, 5),
  "puyol": new Player("puyol","Puyol", "2", Team.TEAM_A, 4, 2, 6),

  "ronaldo": new Player("ronaldo","Ronaldo", "10", Team.TEAM_B, 6, 5, 2),
  "benzema": new Player("benzema","Benzema", "9", Team.TEAM_B, 5, 4, 2),
  "ramos": new Player("ramos","Ramos", "4", Team.TEAM_B, 5, 2, 5),
  "modric": new Player("modric","Modric", "6", Team.TEAM_B, 4, 4, 3),
  "kroos": new Player("kroos","Kroos", "8", Team.TEAM_B, 4, 4, 3),
};
