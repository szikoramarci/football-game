import { Hex, OffsetCoordinates } from "honeycomb-grid";
import { Player } from "../../models/player.model";
import { ActionType } from "../action.type.enum";

export interface ActionContext {
    player: Player | undefined,
    activeActionType: ActionType | undefined
    coordinates: OffsetCoordinates,
    availableNExtMoces
}