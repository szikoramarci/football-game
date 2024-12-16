import { Grid, Hex } from "honeycomb-grid";
import { StepMeta } from "../../../actions/classes/step-meta.interface";

export interface InitMovingStepMeta extends StepMeta {
    reachableHexes: Grid<Hex>,
    playerHex: Hex,
    playerID: string | undefined,
    playerHasBall: boolean
}