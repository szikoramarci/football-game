import { Grid, Hex } from "honeycomb-grid";
import { ActionMeta } from "../interfaces/action.meta.interface";

export interface SetMovingPathActionMeta extends ActionMeta {
    reachableHexes: Grid<Hex>,
    movingPath: Grid<Hex>
}