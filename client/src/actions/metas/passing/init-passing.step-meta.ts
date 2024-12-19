import { Grid, Hex } from "honeycomb-grid";
import { ActionMeta } from "../../classes/action-meta.interface";

export interface InitPassingStepMeta extends ActionMeta {
    playerHex: Hex,
    availableTargets: Grid<Hex>
}