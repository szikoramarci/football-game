import { createAction, props } from "@ngrx/store";
import { HexCoordinates } from "honeycomb-grid";

export const updatePlayerPosition = createAction(
    '[Player Position] Update Player Position',
    props<{ playerID: string; position: HexCoordinates }>()
);