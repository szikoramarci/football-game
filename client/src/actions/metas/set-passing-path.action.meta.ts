import {  OffsetCoordinates } from "honeycomb-grid";
import { InitPassingActionMeta } from "./init-passing.action.meta";
import { Point } from "pixi.js";

export interface SetPassingPathActionMeta extends InitPassingActionMeta {
    passingPath: Point[],
    targetHex: OffsetCoordinates
}