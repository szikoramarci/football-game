import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { ActionMeta } from "../interfaces/action.meta.interface";

export interface InitMovingActionMeta extends ActionMeta {
    reachableHexes: Grid<Hex>,
    playerCoordinates: OffsetCoordinates,
    playerID: string | undefined,
    playerHasBall: boolean
}