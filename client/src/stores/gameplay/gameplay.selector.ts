import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameplayState } from './gameplay.state';
import { getAllPlayers } from '../player/player.selector';
import { playerMovementEvents } from '../player-position/player-position.selector';

export const getGameplay = createFeatureSelector<GameplayState>('gameplay');

export const getAttackingTeam = () =>
    createSelector(getGameplay, (state) => state.attackingTeam);

export const selectPlayersWithPositions = (isAttackingTeam: boolean) => createSelector(
    playerMovementEvents,
    getAllPlayers,
    getGameplay,
    (playerPositions, players, gameplayState) => {
        const attackingTeam = gameplayState.attackingTeam;

        const attackingTeamPlayers = Object.values(players).filter(player => isAttackingTeam ? player.team === attackingTeam : player.team !== attackingTeam);

        return attackingTeamPlayers.map(player => ({
            player: player,
            position: playerPositions[player.id] 
        }));
    });

export const selectAttackingTeamPlayersWithPositions = selectPlayersWithPositions(true);

export const selectDefendingTeamPlayersWithPositions = selectPlayersWithPositions(false);