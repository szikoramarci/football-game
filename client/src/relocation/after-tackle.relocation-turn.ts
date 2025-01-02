import { Grid, Hex } from "honeycomb-grid";
import { Player } from "../models/player.model";
import { RelocationTurn } from "./relocation-turn.interface";

export function generateAfterTackleRelocation(player: Player, allowedTargets: Grid<Hex>): RelocationTurn {
    return {
        team: player.team,
        movementLimit: 1,
        movementType: 'relocation',
        playerFilter(_player: Player) {
            return _player.id == player.id
        },
        allowedTargets(hex: Hex) {
            return allowedTargets.hasHex(hex)
        },
    }
}