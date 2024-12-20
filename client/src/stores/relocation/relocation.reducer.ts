import { createReducer, on } from "@ngrx/store";
import { initialState } from "./relocation.state";
import { addUsedPlayer, initScenario, unshiftScenarioTurn } from "./relocation.actions";

export const relocationReducer = createReducer(
  initialState, 
  on(initScenario, (state, { turns }) => ({
    ...state,
    relocationTurns: turns,
    usedPlayers: new Set<string>()   
  })),  
  on(unshiftScenarioTurn, (state) => {
    const updatedRelocationTurns = state.relocationTurns?.slice(1) || []
    return {    
      ...state,        
      relocationTurns: updatedRelocationTurns,
      usedPlayers: updatedRelocationTurns.length === 0 ? new Set<string>() : state.usedPlayers,
    }
  }),
  on(addUsedPlayer, (state, { playerID }) => ({
    ...state,
    usedPlayers: new Set(state.usedPlayers).add(playerID)
  })),
);