import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PlayerPositionState } from './player-position.state';
import { Grid, Hex, OffsetCoordinates } from 'honeycomb-grid';
import { isEqual } from 'lodash';

export const playerMovementEvents = createFeatureSelector<PlayerPositionState>('playerPosition');

export const playerMoveEvent = (playerID: string) =>
  createSelector(playerMovementEvents, (positions) => positions[playerID]);

const searchPlayerByPosition = (coordinatesToFind: OffsetCoordinates, positions: PlayerPositionState) => {
  return Object.keys(positions).find(key => {
    const coordinates = positions[key];
    return isEqual(coordinates, coordinatesToFind);
  });
}

export const getPlayerByPosition = (coordinatesToFind: OffsetCoordinates) =>
  createSelector(playerMovementEvents, (positions: PlayerPositionState) => {
    return searchPlayerByPosition(coordinatesToFind, positions);
});

export const getFreeCoordinatesInGrid = (grid: Grid<Hex>) =>
  createSelector(playerMovementEvents, (positions: PlayerPositionState) => {
    return grid.filter(hex => {
      const coordinate: OffsetCoordinates = { col: hex.col, row: hex.row };
      return !searchPlayerByPosition(coordinate, positions);
    });
});

export const getOccupiedCoordinatesInGrid = (grid: Grid<Hex>) =>
  createSelector(playerMovementEvents, (positions: PlayerPositionState) => {
    return grid.filter(hex => {
      const coordinate: OffsetCoordinates = { col: hex.col, row: hex.row };
      return !!searchPlayerByPosition(coordinate, positions);
    });
});