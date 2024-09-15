import { createAction, props } from "@ngrx/store";
import { Player } from "../../models/player.model";

export const setPlayer = createAction(
    '[Player] Update Player',
    props<Player>()
);