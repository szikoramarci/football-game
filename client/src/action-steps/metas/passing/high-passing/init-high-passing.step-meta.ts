import { OffsetCoordinates } from "honeycomb-grid";
import { InitPassingStepMeta } from "../init-passing.step-meta";

export interface InitHighPassingStepMeta extends InitPassingStepMeta {
    possibleHeadingPlayers: Map<OffsetCoordinates, OffsetCoordinates[]>
}