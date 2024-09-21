import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { PickUpPlayerActionMeta } from "./pick-up-player.action.meta";

export interface SetMovingPathActionMeta extends PickUpPlayerActionMeta {
    movingPath: Grid<Hex>,
    targetHex: OffsetCoordinates
}