import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PlayerPositionState } from './player-position.state';
import { OffsetCoordinates } from 'honeycomb-grid';
import { isEqual } from 'lodash';

export const playerMovementEvents = createFeatureSelector<PlayerPositionState>('playerPosition');

export const playerMoveEvent = (playerID: string) =>
  createSelector(playerMovementEvents, (positions) => positions[playerID]);

export const getPlayerByPosition = (coordinatesToFind: OffsetCoordinates) =>
  createSelector(playerMovementEvents, (positions: PlayerPositionState) => {
    return Object.keys(positions).find(key => {
      const coordinates = positions[key];
      return isEqual(coordinates, coordinatesToFind);
    });
  });