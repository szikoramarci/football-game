import { createAction, props } from "@ngrx/store";
import { OffsetCoordinates } from "honeycomb-grid";

export const moveBall = createAction(
    '[Ball Position] Update Ball Position',
    props<OffsetCoordinates>()
);