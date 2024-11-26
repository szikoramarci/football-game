import { createAction, props } from "@ngrx/store";
import { RelocationScenario } from "../../relocation/relocation-scenario.interface";

export const setScenario = createAction(
    '[Relocation] Set Scenario',
    props<{ scenario: RelocationScenario }>()
);