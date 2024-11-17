import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { InitMovingActionStepMeta } from "./init-moving.action-step-meta";

export interface SetMovingPathActionStepMeta extends InitMovingActionStepMeta {
    movingPath: Grid<Hex>,
    targetHex: OffsetCoordinates,
    challengeHexes: Map<string,Hex>
}