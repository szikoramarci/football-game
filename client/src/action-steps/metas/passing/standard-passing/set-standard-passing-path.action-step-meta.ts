import {  Hex, OffsetCoordinates } from "honeycomb-grid";
import { InitPassingActionStepMeta } from "../init-passing.action-step-meta";

export interface SetStandardPassingPathActionStepMeta extends InitPassingActionStepMeta {
    passingPath: Hex[] 
    targetHex: OffsetCoordinates
    challengeHexes: Map<string,Hex>
}