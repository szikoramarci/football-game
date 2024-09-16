import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ActionState } from './action.state';

export const getAction = createFeatureSelector<ActionState>('action');

export const getActiveAction = () =>
    createSelector(getAction, (state) => state.currentAction);