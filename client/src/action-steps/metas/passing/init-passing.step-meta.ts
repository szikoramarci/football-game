import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { StepMeta } from "../../interfaces/step-meta.interface";

export interface InitPassingStepMeta extends StepMeta {
    playerCoordinates: OffsetCoordinates,
    availableTargets: Grid<Hex>
}