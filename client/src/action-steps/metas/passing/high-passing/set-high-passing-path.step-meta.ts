import { Hex, OffsetCoordinates } from "honeycomb-grid"
import { InitPassingStepMeta } from "../init-passing.step-meta"

export interface SetHighPassingPathStepMeta extends InitPassingStepMeta {
    passingPath: Hex[] 
    targetHex: OffsetCoordinates,    
}