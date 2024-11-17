import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { ActionStepMeta } from "../../interfaces/action-step-meta.interface";

export interface InitPassingActionStepMeta extends ActionStepMeta {
    playerCoordinates: OffsetCoordinates,
    availableTargets: Grid<Hex>
}