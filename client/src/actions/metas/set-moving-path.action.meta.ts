import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { InitMovingActionMeta } from "./init-moving.action.meta";

export interface SetMovingPathActionMeta extends InitMovingActionMeta {
    movingPath: Grid<Hex>,
    targetHex: OffsetCoordinates
}