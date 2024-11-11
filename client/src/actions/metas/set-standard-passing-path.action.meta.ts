import {  Hex, OffsetCoordinates } from "honeycomb-grid";
import { InitPassingActionMeta } from "./init-passing.action.meta";

export interface SetStandardPassingPathActionMeta extends InitPassingActionMeta {
    passingPath: Hex[] 
    targetHex: OffsetCoordinates
    challengeHexes: Map<string,Hex>
}