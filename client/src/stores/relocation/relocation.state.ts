import { RelocationScenario } from "../../relocation/relocation-scenario.interface";

export interface RelocationState {
  currentRelocationScenario: RelocationScenario | undefined,
  currentStepIndex: number,
  usedPlayers: Set<string>
}

export const initialState: RelocationState = {
  currentRelocationScenario: undefined,
  currentStepIndex: 0,
  usedPlayers: new Set()
};
