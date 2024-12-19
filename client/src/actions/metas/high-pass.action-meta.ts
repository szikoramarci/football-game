import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid"
import { ActionMeta } from "../classes/action-meta.interface"

export interface HighPassActionMeta extends ActionMeta {
    playerHex: Hex,
    availableTargets: Grid<Hex>
    passingPath?: Hex[] 
    targetHex?: OffsetCoordinates, 
    possibleHeadingPlayers?: Map<OffsetCoordinates, OffsetCoordinates[]>       
}