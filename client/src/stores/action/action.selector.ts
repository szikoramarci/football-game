import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ActionState } from './action.state';

export const getActionState = createFeatureSelector<ActionState>('action');

export const getCurrentActionMeta = () =>
    createSelector(getActionState, (state) => state.currentActionMeta);

export const getAvailableActions = () => 
    createSelector(getActionState, (state) => state.availableActions)

export const getSelectableActions = () => 
    createSelector(getActionState, (state) => state.selectableActions)

export const getCurrentAction = () => 
    createSelector(getActionState, (state) => state.currentAction)

export const getGameContext = () => 
    createSelector(getActionState, (state) => state.gameContext)