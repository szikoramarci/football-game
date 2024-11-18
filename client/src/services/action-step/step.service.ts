import { Injectable } from "@angular/core";
import { StepContext } from "../../action-steps/interfaces/step-context.interface";
import { Step } from "../../action-steps/interfaces/step.interface";
import { InitMovingStep } from "./init-moving/init-moving.step.service";
import { SetMovingPathStep } from "./set-moving-path/set-moving-path.step.service";
import { MovePlayerStep } from "./move-player/move-player.step.service";
import { CancelStep } from "./cancel/cancel.service";
import { InitStandardPassingStep } from "./init-standard-passing/init-standard-passing.step.service";
import { SetStandardPassingPathStep } from "./set-standard-passing-path/set-standard-passing-path.step.service";
import { PassBallStep } from "./pass-ball/pass-ball.step.service";
import { InitHighPassingStep } from "./init-high-passing/init-high-passing.step.service";
import { SetHighPassingPathStep } from "./set-high-passing-path/set-high-passing-path.step.service";

@Injectable({
    providedIn: 'root',
})
export class StepService {

  stepList: Step[] = [];

  constructor(

    private initMoving: InitMovingStep,
    private setMovingPath: SetMovingPathStep,
    private movePlayer: MovePlayerStep,

    private initStandardPassing: InitStandardPassingStep,
    private setStandardPassingPath: SetStandardPassingPathStep,
    private passBall: PassBallStep,

    private initHighPassing: InitHighPassingStep,
    private setHighPassingPath: SetHighPassingPathStep,

    private cancelMovingPlayer: CancelStep
  ) {
    this.stepList = [
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

  resolveStep(context: StepContext): Step | null {
    for (const step of this.stepList) {
      if (step.identify(context)) {
        return step;
      }
    }

    return null; 
  }

  executeStep(step: Step, context: StepContext): void {    
    if (step) {
      step.calculation(context);
      step.updateState(context);
    } else {
      console.log("Invalid step.");
    }
  }

}