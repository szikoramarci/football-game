import { Player } from "../../models/player.model";
import { Team } from "../../models/team.enum";

export interface PlayerState {
  [playerID: string]: Player 
}

export const initialState: PlayerState = {
  "messi": new Player("messi","Messi", "10", Team.TEAM_A),
  "suarez": new Player("suarez","Suarez", "9", Team.TEAM_A),
  "busquets": new Player("busquets","Busquets", "5", Team.TEAM_A),
  "piqué": new Player("piqué","Piqué", "3", Team.TEAM_A),
  "puyol": new Player("puyol","Puyol", "2", Team.TEAM_A),

  "ronaldo": new Player("ronaldo","Ronaldo", "10", Team.TEAM_B),
  "benzema": new Player("benzema","Benzema", "9", Team.TEAM_B),
  "ramos": new Player("ramos","Ramos", "4", Team.TEAM_B),
  "modric": new Player("modric","Modric", "6", Team.TEAM_B),
  "kroos": new Player("kroos","Kroos", "8", Team.TEAM_B),
};
