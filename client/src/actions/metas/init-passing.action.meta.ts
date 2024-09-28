import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { ActionMeta } from "../interfaces/action.meta.interface";

export interface InitPassingActionMeta extends ActionMeta {
    playerCoordinates: OffsetCoordinates,
    availableTargets: Grid<Hex>
}