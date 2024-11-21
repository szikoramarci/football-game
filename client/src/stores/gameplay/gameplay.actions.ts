import { createAction, props } from "@ngrx/store";

export const setAttackingTeam = createAction(
    '[GamePlay] Set Attacking Team',
    props<{ attackingTeam: string }>()
);