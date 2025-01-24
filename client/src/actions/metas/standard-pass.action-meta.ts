import {  Grid, Hex, OffsetCoordinates } from "@szikoramarci/honeycomb-grid";
import { ActionMeta, IsActionMeta } from "../classes/action-meta.interface";

export interface StandardPassActionMeta extends ActionMeta {    
    availableTargets: Grid<Hex>
    passingPath?: Hex[] 
    targetHex?: OffsetCoordinates
    challengeHexes?: Map<string,Hex>
}

export function IsStandardPassActionMeta(actionMeta: ActionMeta): boolean {
    return (
        IsActionMeta(actionMeta) && 
        'availableTargets' in actionMeta &&
        'targetHex' in actionMeta &&
        'challengeHexes' in actionMeta
    );
}