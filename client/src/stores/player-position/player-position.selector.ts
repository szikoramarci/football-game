import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PlayerPositionState } from './player-position.state';
import { equals, Grid, Hex, OffsetCoordinates } from 'honeycomb-grid';

export const playerMovementEvents = createFeatureSelector<PlayerPositionState>('playerPosition');

export const getPlayerPosition = (playerID: string) =>
  createSelector(playerMovementEvents, (positions) => positions[playerID]);

const searchPlayerByPosition = (coordinatesToFind: OffsetCoordinates, positions: PlayerPositionState) => {
  return Object.keys(positions).find(key => {
    const coordinates = positions[key];
    return equals(coordinates, coordinatesToFind);
  });
}

export const getPlayerByPosition = (coordinatesToFind: OffsetCoordinates) =>
  createSelector(playerMovementEvents, (positions: PlayerPositionState) => {
    return searchPlayerByPosition(coordinatesToFind, positions);
});

export const getPositionsByPlayerIDs = (playerIDs: string[]) =>
  createSelector(playerMovementEvents, (positions: PlayerPositionState) => {
    return Object.fromEntries(
      Object.entries(positions).filter(([playerID]) => playerIDs.includes(playerID))
    );
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