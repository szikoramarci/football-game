import { Hex } from "honeycomb-grid";
import { Player } from "../models/player.model";

export interface HexRelatedPlayers {
    hex: Hex,
    players: Player[]
}