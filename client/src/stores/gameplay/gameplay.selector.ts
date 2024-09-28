import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameplayState } from './gameplay.state';
import { getAllPlayers } from '../player/player.selector';
import { playerMovementEvents } from '../player-position/player-position.selector';

export const getGameplay = createFeatureSelector<GameplayState>('gameplay');

export const getActiveTeam = () =>
    createSelector(getGameplay, (state) => state.activeTeam);

export const selectPlayersWithPositions = (isActiveTeam: boolean) => createSelector(
    playerMovementEvents,
    getAllPlayers,
    getGameplay,
    (playerPositions, players, gameplayState) => {
        const activeTeam = gameplayState.activeTeam;

        const activeTeamPlayers = Object.values(players).filter(player => isActiveTeam ? player.team === activeTeam : player.team !== activeTeam);

        const activeTeamPlayersWithPositions = activeTeamPlayers.map(player => ({
            ...player,
            position: playerPositions[player.id] 
        }));

        return activeTeamPlayersWithPositions;
    });

export const selectActiveTeamPlayersWithPositions = selectPlayersWithPositions(true);

export const selectOppositeTeamPlayersWithPositions = selectPlayersWithPositions(false);