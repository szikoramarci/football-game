import { Process } from "../../processes/process.interface";

export interface ProcessState {
  currentProcess: Process | null
}

export const initialState: ProcessState = {
  currentProcess: null
};
