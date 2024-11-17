import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { ActionStepMeta } from "../../interfaces/action-step-meta.interface";

export interface InitMovingActionStepMeta extends ActionStepMeta {
    reachableHexes: Grid<Hex>,
    playerCoordinates: OffsetCoordinates,
    playerID: string | undefined,
    playerHasBall: boolean
}