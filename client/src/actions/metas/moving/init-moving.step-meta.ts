import { Grid, Hex } from "honeycomb-grid";
import { ActionMeta } from "../../classes/action-meta.interface";

export interface InitMovingStepMeta extends ActionMeta {
    reachableHexes: Grid<Hex>,
    playerHex: Hex,
    playerID: string | undefined,
    playerHasBall: boolean
}