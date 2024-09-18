import { Hex } from "honeycomb-grid";
import { ActionMeta } from "../interfaces/action.meta.interface";

export interface PickUpPlayerActionMeta extends ActionMeta {
    movableHexes: Hex[]
}