import { createReducer, on } from "@ngrx/store";
import { initialState } from "./relocation.state";
import { setScenario } from "./relocation.actions";

export const relocationReducer = createReducer(
  initialState, 
  on(setScenario, (relocation, { scenario }) => ({
    ...relocation,
    currentRelocationScenario: scenario      
  }))
);