import { OffsetCoordinates } from "@szikoramarci/honeycomb-grid";
import { Player } from "../models/player.model";

export interface PlayerWithPosition {
    player: Player,
    position: OffsetCoordinates
}