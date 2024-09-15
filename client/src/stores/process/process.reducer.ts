import { createReducer, on } from "@ngrx/store";
import { initialState } from "./process.state";
import { startProcess, stopProcess } from "./process.actions";

export const processReducer = createReducer(
    initialState,
    on(startProcess, (state, process) => ({      
      ...state,
      currentProcess: process
    }),),
    on(stopProcess, (state) => ({      
      ...state,
      currentProcess: null
    }),)
  );