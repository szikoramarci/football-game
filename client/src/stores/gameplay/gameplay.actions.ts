import { createAction, props } from "@ngrx/store";

export const setActiveTeam = createAction(
    '[GamePlay] Set Active Team',
    props<{ activeTeam: string }>()
);