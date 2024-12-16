import { Grid, Hex } from "honeycomb-grid";
import { StepMeta } from "../../../actions/classes/step-meta.interface";

export interface InitPassingStepMeta extends StepMeta {
    playerHex: Hex,
    availableTargets: Grid<Hex>
}