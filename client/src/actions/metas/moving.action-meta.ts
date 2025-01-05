import { Grid, Hex } from "honeycomb-grid";
import { ActionMeta, IsActionMeta } from "../classes/action-meta.interface";
import { Player } from "../../models/player.model";

export interface MovingActionMeta extends ActionMeta {
    reachableHexes: Grid<Hex>
    player: Player
    playerHasBall: boolean
    pathPoints: Hex[]
    finalMovingPath: Grid<Hex> 
    possibleMovingPath: Grid<Hex>
    challengeHexes?: Map<string,Hex>
}

export function IsMovingActionMeta(actionMeta: ActionMeta): boolean {
    return (
        IsActionMeta(actionMeta) && 
        'finalMovingPath' in actionMeta &&
        'challengeHexes' in actionMeta
    );
}