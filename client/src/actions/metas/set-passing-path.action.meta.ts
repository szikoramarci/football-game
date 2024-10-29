import {  Hex, OffsetCoordinates, Point } from "honeycomb-grid";
import { InitPassingActionMeta } from "./init-passing.action.meta";

export interface SetPassingPathActionMeta extends InitPassingActionMeta {
    passingPath: Hex[] 
    targetHex: OffsetCoordinates
    challengeHexes: Map<string,Hex>
    testPoints: Point[]
}