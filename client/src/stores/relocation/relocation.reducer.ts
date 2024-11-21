import { createReducer } from "@ngrx/store";
import { initialState } from "./relocation.state";

export const relocationReducer = createReducer(
  initialState, 
);