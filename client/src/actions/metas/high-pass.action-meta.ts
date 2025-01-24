import { Grid, Hex, OffsetCoordinates } from "@szikoramarci/honeycomb-grid"
import { ActionMeta, IsActionMeta } from "../classes/action-meta.interface"

export interface HighPassActionMeta extends ActionMeta {    
    availableTargets: Grid<Hex>
    passingPath?: Hex[] 
    targetHex?: OffsetCoordinates, 
    possibleHeadingPlayers?: Map<OffsetCoordinates, OffsetCoordinates[]>       
}

export function IsHighPassActionMeta(actionMeta: ActionMeta): boolean {
    return (
        IsActionMeta(actionMeta) && 
        'possibleHeadingPlayers' in actionMeta
    );
}