import { Grid, Hex } from "@szikoramarci/honeycomb-grid"
import { ActionMeta, IsActionMeta } from "../classes/action-meta.interface"
import { Player } from "../../models/player.model"

export interface TacklingActionMeta extends ActionMeta {
    possibleTacklingHexes: Grid<Hex>    
    movingPath?: Grid<Hex>    
    player: Player
    ballHex: Hex
    ballerPlayer: Player
    ballerAdjacentHexes: Grid<Hex> 
    tacklerAdjacentHexes?: Grid<Hex>
}

export function IsTacklingActionMeta(actionMeta: ActionMeta): boolean {
    return (
        IsActionMeta(actionMeta) && 
        'possibleTacklingHexes' in actionMeta
    );
}