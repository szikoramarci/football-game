import { createAction, props } from "@ngrx/store";
import { Team } from "../../models/team.enum";

export const setAttackingTeam = createAction(
    '[GamePlay] Set Attacking Team',
    props<{ attackingTeam: Team }>()
);