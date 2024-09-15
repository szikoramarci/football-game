import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PlayerPositionState } from './player-position.state';

export const playerMovementEvents = createFeatureSelector<PlayerPositionState>('playerPosition');

export const playerMoveEvent = (playerID: string) =>
  createSelector(playerMovementEvents, (state) => state.players[playerID]);