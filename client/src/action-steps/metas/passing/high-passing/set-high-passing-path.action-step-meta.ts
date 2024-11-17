import { Hex, OffsetCoordinates } from "honeycomb-grid"
import { InitPassingActionStepMeta } from "../init-passing.action-step-meta"

export interface SetHighPassingPathActionStepMeta extends InitPassingActionStepMeta {
    passingPath: Hex[] 
    targetHex: OffsetCoordinates,    
}