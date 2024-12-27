import { Grid, Hex } from "honeycomb-grid"
import { ActionMeta } from "../classes/action-meta.interface"

export interface TacklingActionMeta extends ActionMeta {
    possibleTacklingHexes: Grid<Hex>
    finalMovingPath?: Grid<Hex>
}