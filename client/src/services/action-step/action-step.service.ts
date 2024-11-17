import { Injectable } from "@angular/core";
import { ActionStepContext } from "../../action-steps/interfaces/action-step-context.interface";
import { ActionStepStrategy } from "../../action-steps/interfaces/action-step-strategy.interface";
import { InitMovingActionStep } from "./init-moving/init-moving.action.service";
import { SetMovingPathActionStep } from "./set-moving-path/set-moving-path.action.service";
import { MovePlayerActionStep } from "./move-player/move-player.action.service";
import { CancelActionStep } from "./cancel/cancel.service";
import { InitStandardPassingActionStep } from "./init-standard-passing/init-standard-passing.action.service";
import { SetStandardPassingPathActionStep } from "./set-standard-passing-path/set-standard-passing-path.action.service";
import { PassBallActionStep } from "./pass-ball/pass-ball.action.service";
import { InitHighPassingActionStep } from "./init-high-passing/init-high-passing.action.service";
import { SetHighPassingPathActionStep } from "./set-high-passing-path/set-high-passing-path.action.service";

@Injectable({
    providedIn: 'root',
})
export class ActionStepService {

  actionList: ActionStepStrategy[] = [];

  constructor(

    private initMoving: InitMovingActionStep,
    private setMovingPath: SetMovingPathActionStep,
    private movePlayer: MovePlayerActionStep,

    private initStandardPassing: InitStandardPassingActionStep,
    private setStandardPassingPath: SetStandardPassingPathActionStep,
    private passBall: PassBallActionStep,

    private initHighPassing: InitHighPassingActionStep,
    private setHighPassingPath: SetHighPassingPathActionStep,

    private cancelMovingPlayer: CancelActionStep
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

  resolveAction(context: ActionStepContext): ActionStepStrategy | null {
    for (const action of this.actionList) {
      if (action.identify(context)) {
        return action;
      }
    }

    return null; 
  }

  executeAction(action: ActionStepStrategy, context: ActionStepContext): void {    
    if (action) {
      action.calculation(context);
      action.updateState(context);
    } else {
      console.log("Invalid action.");
    }
  }

}