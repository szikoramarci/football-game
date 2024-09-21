import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { ActionMeta } from "../interfaces/action.meta.interface";

export interface PickUpPlayerActionMeta extends ActionMeta {
    reachableHexes: Grid<Hex>,
    playerCoordinates: OffsetCoordinates,
    playerID: string | undefined
}