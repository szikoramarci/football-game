import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { InitMovingStepMeta } from "./init-moving.step-meta";

export interface SetMovingPathStepMeta extends InitMovingStepMeta {
    movingPath: Grid<Hex>,
    targetHex: OffsetCoordinates,
    challengeHexes: Map<string,Hex>
}