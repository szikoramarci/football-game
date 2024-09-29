import { Injectable } from "@angular/core";
import { ActionContext } from "../../actions/interfaces/action.context.interface";
import { ActionStrategy } from "../../actions/interfaces/action.strategy.interface";
import { InitMovingAction } from "./init-moving/init-moving.action.service";
import { SetMovingPathAction } from "./set-moving-path/set-moving-path.action.service";
import { MovePlayerAction } from "./move-player/move-player.action.service";
import { CancelAction } from "./cancel/cancel.service";
import { InitPassingAction } from "./init-passing/init-passing.action.service";
import { SetPassingPathAction } from "./set-passing-path/set-passing-path.action.service";
import { PassBallAction } from "./pass-ball/pass-ball.action.service";

@Injectable({
    providedIn: 'root',
})
export class ActionService {

  actionList: ActionStrategy[] = [];

  constructor(

    private initMoving: InitMovingAction,
    private setMovingPath: SetMovingPathAction,
    private movePlayer: MovePlayerAction,

    private initPassing: InitPassingAction,
    private setPassingPath: SetPassingPathAction,
    private passBall: PassBallAction,

    private cancelMovingPlayer: CancelAction
  ) {
    this.actionList = [
      this.initMoving,
      this.setMovingPath,
      this.movePlayer,

      this.initPassing,
      this.setPassingPath,
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