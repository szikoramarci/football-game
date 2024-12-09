import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ActionState } from './action.state';

export const getActionState = createFeatureSelector<ActionState>('action');

export const getLastStepMeta = () =>
    createSelector(getActionState, (state) => state.lastStepMeta);

export const getAvailableActions = () => 
    createSelector(getActionState, (state) => state.availableActions)

export const getCurrentAction = () => 
    createSelector(getActionState, (state) => state.currentAction)

export const getCurrentStepIndex = () => 
    createSelector(getActionState, (state) => state.currentStepIndex)

export const getActionContext = () => 
    createSelector(getActionState, (state) => state.actionContext)