import { Player } from "../../models/player.model";

export interface PlayerState {
  [playerID: string]: Player 
}

export const initialState: PlayerState = {
  "messi": new Player("messi","Messi", "10"),
  "suarez": new Player("suarez","Suarez", "9"),
  "busquets": new Player("busquets","Busquets", "5")
};
