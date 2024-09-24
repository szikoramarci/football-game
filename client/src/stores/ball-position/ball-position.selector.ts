import { createFeatureSelector } from '@ngrx/store';
import { BallPositionState } from './ball-position.state';

export const ballPosition = createFeatureSelector<BallPositionState>('ballPosition');