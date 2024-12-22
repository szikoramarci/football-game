import { Grid, Hex } from "honeycomb-grid";
import { ActionMeta } from "../classes/action-meta.interface";
import { Player } from "../../models/player.model";

export interface MovingActionMeta extends ActionMeta {
    reachableHexes: Grid<Hex>
    playerHex: Hex
    player: Player
    playerHasBall: boolean
    pathPoints: Hex[]
    movingPath?: Grid<Hex>    
    challengeHexes?: Map<string,Hex>
}