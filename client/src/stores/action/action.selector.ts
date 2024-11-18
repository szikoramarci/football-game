import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ActionState } from './action.state';

export const getStep = createFeatureSelector<ActionState>('step');

export const getLastStepMeta = () =>
    createSelector(getStep, (state) => state.lastStepMeta);
