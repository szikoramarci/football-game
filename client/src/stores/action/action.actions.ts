import { createAction, props } from "@ngrx/store";
import { ActionMeta } from "../../actions/classes/action-meta.interface";
import { GameContext } from "../../actions/classes/game-context.interface";
import { Action } from "../../actions/classes/action.class";
import { Type } from "@angular/core";
import { Event } from "../../enums/event.enum";

export const saveActionMeta = createAction(
    '[Action] Save Action Meta',
    props<ActionMeta>()
);

export const clearActionMeta = createAction('[Step] Clear Action Meta');

export const setLastEvent = createAction(
    '[Action] Set Last Event',
    props<{ event: Event }>()
);

export const setSelectableActions = createAction(
    '[Action] Set Selectable Actions',
    props<{ actions: Type<Action>[] }>()
)

export const clearSelectableActions = createAction('[Action] Clear Selectable Actions')

export const setCurrentAction = createAction(
    '[Action] Set Current Action',
    props<{ action: Type<Action> }>()
);

export const clearCurrentAction = createAction('[Action] Clear Current Action');

export const setGameContext = createAction(
    '[Action] Set Game Context',
    props<{ gameContext: GameContext }>()
);

export const clearGameContext = createAction('[Action] Clear Action Context')

export const setCurrentStepIndex = createAction(
    '[Action] Set Current Step Index',
    props<{ index: number }>()
);