import { Type } from "@angular/core";
import { GameContext } from "../../actions/classes/game-context.interface";
import { ActionMeta } from "../../actions/classes/action-meta.interface";
import { Action } from "../../actions/classes/action.class";
import { Event } from "../../enums/event.enum";

export interface ActionState {
  currentActionMeta: ActionMeta | undefined,
  currentAction: Type<Action> | undefined,
  gameContext: GameContext | undefined,
  lastEvent: Event | undefined, 
  selectableActions: Type<Action>[]
}

export const initialState: ActionState = {
  currentActionMeta: undefined,
  currentAction: undefined,
  gameContext: undefined,
  lastEvent: undefined,
  selectableActions: []
};
