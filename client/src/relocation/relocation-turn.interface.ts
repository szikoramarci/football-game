import { Hex } from "@szikoramarci/honeycomb-grid";
import { Player } from "../models/player.model";

export interface RelocationTurn {
    team: string,
    playerFilter?: (player: Player) => boolean,
    movementLimit: number | 'unlimited' | 'ownSpeed',
    movementType: 'steps' | 'relocation', 
    allowedTargets?: (hex: Hex) => boolean,
}