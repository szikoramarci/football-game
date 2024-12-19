import { Grid, Hex } from "honeycomb-grid";
import { ActionMeta } from "../classes/action-meta.interface";

export interface MovingActionMeta extends ActionMeta {
    reachableHexes: Grid<Hex>
    playerHex: Hex
    playerID: string | undefined
    playerHasBall: boolean
    movingPath?: Grid<Hex>
    targetHex?: Hex
    challengeHexes?: Map<string,Hex>
}