import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameplayState } from './gameplay.state';

export const getGameplay = createFeatureSelector<GameplayState>('gameplay');

export const getActiveTeam = () =>
    createSelector(getGameplay, (state) => state.activeTeam);
