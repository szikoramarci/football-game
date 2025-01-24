import { Grid, Hex } from "@szikoramarci/honeycomb-grid";
import { Player } from "../../models/player.model";
import { ActionMeta, IsActionMeta } from "../classes/action-meta.interface";

export interface RelocationActionMeta extends ActionMeta {
    reachableHexes: Grid<Hex>
    targetHex: Hex | undefined
    player: Player
    playerHasBall: boolean
}

export function IsRelocationActionMeta(actionMeta: ActionMeta): boolean {
    return (
        IsActionMeta(actionMeta) && 
        'reachableHexes' in actionMeta &&
        'targetHex' in actionMeta
    );
}