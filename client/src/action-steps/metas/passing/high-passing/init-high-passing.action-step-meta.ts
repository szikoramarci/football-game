import { OffsetCoordinates } from "honeycomb-grid";
import { InitPassingActionStepMeta } from "../init-passing.action-step-meta";

export interface InitHighPassingActionStepMeta extends InitPassingActionStepMeta {
    possibleHeadingPlayers: Map<OffsetCoordinates, OffsetCoordinates[]>
}