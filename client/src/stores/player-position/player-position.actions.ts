import { createAction, props } from "@ngrx/store";
import { OffsetCoordinates } from "@szikoramarci/honeycomb-grid";

export const movePlayer = createAction(
    '[Player Position] Update Player Position',
    props<{ playerID: string; position: OffsetCoordinates }>()
);