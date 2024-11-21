import { RelocationScenario } from "../../relocation/relocation-scenario.interface";

export interface GameplayState {
  activeTeam: string,
  currentRelocationScenario: RelocationScenario | undefined,
  currentStepIndex: number,
  usedPlayers: Set<string>
}

export const initialState: GameplayState = {
  activeTeam: 'barca',
  currentRelocationScenario: undefined,
  currentStepIndex: 0,
  usedPlayers: new Set()
};
