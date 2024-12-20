import {  Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { ActionMeta } from "../classes/action-meta.interface";

export interface StandardPassActionMeta extends ActionMeta {    
    playerHex: Hex
    availableTargets: Grid<Hex>
    passingPath?: Hex[] 
    targetHex?: OffsetCoordinates
    challengeHexes?: Map<string,Hex>
}