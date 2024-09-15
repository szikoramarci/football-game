import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProcessState } from './process.state';

export const getProcess = createFeatureSelector<ProcessState>('process');

export const getActiveProcess = () =>
    createSelector(getProcess, (state) => state.currentProcess);