import { Injectable } from "@angular/core";
import { ActionContext } from "../../actions/interfaces/action.context.interface";
import { ActionStrategy } from "../../actions/interfaces/action.strategy.interface";
import { InitMovingAction } from "./init-moving/init-moving.action.service";
import { SetMovingPathAction } from "./set-moving-path/set-moving-path.action.service";
import { MovePlayerAction } from "./move-player/move-player.action.service";
import { CancelAction } from "./cancel/cancel.service";
import { InitStandardPassingAction } from "./init-standard-passing/init-standard-passing.action.service";
import { SetStandardPassingPathAction } from "./set-standard-passing-path/set-standard-passing-path.action.service";
import { PassBallAction } from "./pass-ball/pass-ball.action.service";
import { InitHighPassingAction } from "./init-high-passing/init-high-passing.action.service";
import { SetHighPassingPathAction } from "./set-high-passing-path/set-high-passing-path.action.service";

@Injectable({
    providedIn: 'root',
})
export class ActionService {

  actionList: ActionStrategy[] = [];

  constructor(

    private initMoving: InitMovingAction,
    private setMovingPath: SetMovingPathAction,
    private movePlayer: MovePlayerAction,

    private initStandardPassing: InitStandardPassingAction,
    private setStandardPassingPath: SetStandardPassingPathAction,
    private passBall: PassBallAction,

    private initHighPassing: InitHighPassingAction,
    private setHighPassingPath: SetHighPassingPathAction,

    private cancelMovingPlayer: CancelAction
  ) {
    this.actionList = [
      this.initMoving,
      this.setMovingPath,
      this.movePlayer,

      this.initStandardPassing,
      this.setStandardPassingPath,      

      this.initHighPassing,
      this.setHighPassingPath,

      this.passBall,

      this.cancelMovingPlayer
    ]
  }

  resolveAction(context: ActionContext): ActionStrategy | null {
    for (const action of this.actionList) {
      if (action.identify(context)) {
        return action;
      }
    }

    return null; 
  }

  executeAction(action: ActionStrategy, context: ActionContext): void {    
    if (action) {
      action.calculation(context);
      action.updateState(context);
    } else {
      console.log("Invalid action.");
    }
  }

}