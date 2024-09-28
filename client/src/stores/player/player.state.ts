import { Player } from "../../models/player.model";

export interface PlayerState {
  [playerID: string]: Player 
}

export const initialState: PlayerState = {
  "messi": new Player("messi","Messi", "10", "barca"),
  "suarez": new Player("suarez","Suarez", "9", "barca"),
  "busquets": new Player("busquets","Busquets", "5", "barca"),
  "piqué": new Player("piqué","Piqué", "3", "barca"),
  "puyol": new Player("puyol","Puyol", "2", "barca"),

  "ronaldo": new Player("ronaldo","Ronaldo", "10", "real"),
  "benzema": new Player("benzema","Benzema", "9", "real"),
  "ramos": new Player("ramos","Ramos", "4", "real"),
  "modric": new Player("modric","Modric", "6", "real"),
  "kroos": new Player("kroos","Kroos", "8", "real"),
};
