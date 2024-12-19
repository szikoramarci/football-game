import { createAction, props } from "@ngrx/store";
import { RelocationTurn } from "../../relocation/relocation-turn.interface";

export const initScenario = createAction(
    '[Relocation] Set Scenario',
    props<{ turns: RelocationTurn[] }>()
);

export const unshiftScenarioTurn = createAction(
    '[Relocation] Unshift Scenario Turn'
);