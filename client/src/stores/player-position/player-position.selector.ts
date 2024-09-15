import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PlayerPositionState } from './player-position.state';
import { OffsetCoordinates } from 'honeycomb-grid';
import { isEqual } from 'lodash';

export const playerMovementEvents = createFeatureSelector<PlayerPositionState>('playerPosition');

export const playerMoveEvent = (playerID: string) =>
  createSelector(playerMovementEvents, (state) => state.players[playerID]);

export const getPlayerByPosition = (coordinatesToFind: OffsetCoordinates) =>
  createSelector(playerMovementEvents, (state: PlayerPositionState) => {
    return Object.keys(state.players).find(key => {
      const coordinates = state.players[key];
      return isEqual(coordinates, coordinatesToFind);
    });
  });