import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BallPositionState } from './ball-position.state';
import { equals, OffsetCoordinates } from 'honeycomb-grid';

export const ballPosition = createFeatureSelector<BallPositionState>('ballPosition');

export const IsBallInPosition = (coordinates: OffsetCoordinates) => 
    createSelector(ballPosition, (state) => equals(state.ballPosition, coordinates));

export const getBallPosition = () => 
    createSelector(ballPosition, (state) => state.ballPosition);
