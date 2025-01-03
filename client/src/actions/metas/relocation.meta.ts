import { Grid, Hex } from "honeycomb-grid";
import { Player } from "../../models/player.model";
import { ActionMeta } from "../classes/action-meta.interface";

export interface RelocationActionMeta extends ActionMeta {
    reachableHexes: Grid<Hex>
    player: Player
    playerHasBall: boolean
}