import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { playerPositionReducer } from '../../stores/player-position/player-position.reducer';
import { playerReducer } from '../../stores/player/player.reducer';
import { actionReducer } from '../../stores/action/action.reducer';
import { ballPositionReducer } from '../../stores/ball-position/ball-position.reducer';
import { gameplayReducer } from '../../stores/gameplay/gameplay.reducer';
import { relocationReducer } from '../../stores/relocation/relocation.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideStore({
      playerPosition: playerPositionReducer,
      ballPosition: ballPositionReducer,
      player: playerReducer,      
      action: actionReducer,
      gameplay: gameplayReducer,
      relocation: relocationReducer
    })
  ]
};
