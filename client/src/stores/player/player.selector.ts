import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PlayerState } from './player.state';

export const getAllPlayers = createFeatureSelector<PlayerState>('player');

export const getPlayer = (playerID: string) =>
  createSelector(getAllPlayers, (players) => players[playerID]);
