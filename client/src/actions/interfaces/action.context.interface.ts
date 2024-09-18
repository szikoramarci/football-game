import { OffsetCoordinates } from "honeycomb-grid";
import { Player } from "../../models/player.model";

export interface ActionContext {
    player: Player | undefined,
    coordinates: OffsetCoordinates
}