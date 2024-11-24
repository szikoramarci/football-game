import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { StepMeta } from "../../classes/step-meta.interface";

export interface InitMovingStepMeta extends StepMeta {
    reachableHexes: Grid<Hex>,
    playerCoordinates: OffsetCoordinates,
    playerID: string | undefined,
    playerHasBall: boolean
}