import { createReducer, on } from "@ngrx/store";
import { initialState } from "./relocation.state";
import { addUsedPlayer, clearScenario, initScenario, unshiftScenarioTurn, shiftScenarioTurn } from "./relocation.actions";

export const relocationReducer = createReducer(
  initialState, 
  on(initScenario, (state, { turns }) => ({
    ...state,
    relocationTurns: turns,
    usedPlayers: new Set<string>()   
  })),  
  on(clearScenario, (state) => ({
    ...state,
    relocationTurns: [],
    usedPlayers: new Set<string>()    
  })),
  on(shiftScenarioTurn, (state) => {
    const updatedRelocationTurns = state.relocationTurns?.slice(1) || []
    return {    
      ...state,        
      relocationTurns: updatedRelocationTurns,
      usedPlayers: updatedRelocationTurns.length === 0 ? new Set<string>() : state.usedPlayers,
    }
  }),
  on(unshiftScenarioTurn, (state, { relocationTurn }) => {
    const updatedRelocationTurns = [...state.relocationTurns]
    updatedRelocationTurns.unshift(relocationTurn)
    return {    
      ...state,        
      relocationTurns: updatedRelocationTurns,
      usedPlayers: state.usedPlayers,
    }
  }),
  on(addUsedPlayer, (state, { playerID }) => ({
    ...state,
    usedPlayers: new Set(state.usedPlayers).add(playerID)
  }))
);