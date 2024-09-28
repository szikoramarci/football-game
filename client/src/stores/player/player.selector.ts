import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PlayerState } from './player.state';

export const getAllPlayers = createFeatureSelector<PlayerState>('player');

export const getPlayer = (playerID: string) =>
  createSelector(getAllPlayers, (players) => players[playerID]);

export const getPlayersFromTeam = (team: string) =>
  createSelector(getAllPlayers, (players) => Object.values(players).filter(player => player.team == team));

export const getPlayersFromOppositeTeam = (team: string) =>
  createSelector(getAllPlayers, (players) => Object.values(players).filter(player => player.team != team));


