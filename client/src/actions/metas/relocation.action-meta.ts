import { Grid, Hex } from "honeycomb-grid";
import { Player } from "../../models/player.model";
import { ActionMeta, IsActionMeta } from "../classes/action-meta.interface";

export interface RelocationActionMeta extends ActionMeta {
    reachableHexes: Grid<Hex>
    targetHex?: Hex
    player: Player
    playerHasBall: boolean
}

export function IsRelocationActionMeta(actionMeta: ActionMeta): boolean {
    return (
        IsActionMeta(actionMeta) && 
        'targetHex' in actionMeta && 
        'reachableHexes' in actionMeta
    );
}