import { Type } from "@angular/core";
import { GameContext } from "../../actions/classes/game-context.interface";
import { ActionMeta } from "../../actions/classes/action-meta.interface";
import { Action } from "../../actions/classes/action.class";
import { MovingAction } from "../../actions/moving.action";
import { StandardPassAction } from "../../actions/standard-pass.action";
import { HighPassAction } from "../../actions/high-pass.action";
import { TacklingAction } from "../../actions/tackling.action";
import { RelocationAction } from "../../actions/relocation.action";

export interface ActionState {
  currentActionMeta: ActionMeta | undefined,
  currentAction: Type<Action> | undefined,
  gameContext: GameContext | undefined,
  availableActions: Type<Action>[],
  selectableActions: Type<Action>[]
}

export const initialState: ActionState = {
  currentActionMeta: undefined,
  currentAction: undefined,
  gameContext: undefined,
  availableActions: [RelocationAction, MovingAction, TacklingAction, StandardPassAction, HighPassAction],
  selectableActions: []
};
