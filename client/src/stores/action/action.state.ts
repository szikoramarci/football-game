import { Type } from "@angular/core";
import { GameContext } from "../../actions/classes/game-context.interface";
import { StepMeta } from "../../actions/classes/step-meta.interface";
import { Action } from "../../actions/classes/action.class";
import { MovingAction } from "../../actions/moving.action";
import { StandardPassAction } from "../../actions/standard-pass.action";
import { HighPassAction } from "../../actions/high-pass.action";

export interface ActionState {
  lastStepMeta: StepMeta | undefined,
  currentAction: Type<Action> | undefined,
  currentStepIndex: number,
  actionContext: GameContext | undefined,
  availableActions: Type<Action>[],
  selectableActions: Type<Action>[]
}

export const initialState: ActionState = {
  lastStepMeta: undefined,
  currentAction: undefined,
  currentStepIndex: 0,
  actionContext: undefined,
  availableActions: [MovingAction, StandardPassAction, HighPassAction],
  selectableActions: []
};
