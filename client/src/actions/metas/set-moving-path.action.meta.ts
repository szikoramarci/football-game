import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { ActionMeta } from "../interfaces/action.meta.interface";
import { PickUpPlayerActionMeta } from "./pick-up-player.action.meta";

export interface SetMovingPathActionMeta extends PickUpPlayerActionMeta {
    movingPath: Grid<Hex>
}