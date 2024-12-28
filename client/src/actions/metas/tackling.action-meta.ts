import { Grid, Hex } from "honeycomb-grid"
import { ActionMeta } from "../classes/action-meta.interface"
import { Player } from "../../models/player.model"

export interface TacklingActionMeta extends ActionMeta {
    possibleTacklingHexes: Grid<Hex>
    movingPath?: Grid<Hex>
    player: Player,
    ballHex: Hex,
    ballerPlayer: Player
}