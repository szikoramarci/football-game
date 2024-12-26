import { createAction, props } from "@ngrx/store";
import { RelocationTurn } from "../../relocation/relocation-turn.interface";

export const initScenario = createAction(
    '[Relocation] Init Scenario',
    props<{ turns: RelocationTurn[] }>()
);

export const clearScenario = createAction(
    '[Relocation] Clear Scenario'
);

export const unshiftScenarioTurn = createAction(
    '[Relocation] Unshift Scenario Turn'
);

export const addUsedPlayer = createAction(
    '[Relocation] Add Used Player',
    props<{ playerID: string }>()
);

export const setReadyToTacklePlayerID = createAction(
    '[Relocation] Set Ready To Tackle Player ID',
    props<{ playerID: string | null }>()
);
