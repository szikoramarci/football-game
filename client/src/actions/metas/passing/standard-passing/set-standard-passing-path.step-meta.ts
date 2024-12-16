import {  Hex, OffsetCoordinates } from "honeycomb-grid";
import { InitPassingStepMeta } from "../init-passing.step-meta";

export interface SetStandardPassingPathStepMeta extends InitPassingStepMeta {
    passingPath: Hex[] 
    targetHex: OffsetCoordinates
    challengeHexes: Map<string,Hex>
}