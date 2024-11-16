import { OffsetCoordinates } from "honeycomb-grid";
import { InitPassingActionMeta } from "./init-passing.action.meta";

export interface InitHighPassingActionMeta extends InitPassingActionMeta {
    possibleHeadingPlayers: Map<OffsetCoordinates, OffsetCoordinates[]>
}