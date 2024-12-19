import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RelocationState } from './relocation.state';

export const getRelocationState = createFeatureSelector<RelocationState>('relocation');
