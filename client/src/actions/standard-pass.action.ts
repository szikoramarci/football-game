import { InitStandardPassingStep } from "../services/action-step/standard-pass/init-standard-passing/init-standard-passing.step.service";
import { SetStandardPassingPathStep } from "../services/action-step/standard-pass/set-standard-passing-path/set-standard-passing-path.step.service";
import { StandardPassBallStep } from "../services/action-step/standard-pass/standard-pass-ball/standard-pass-ball.step.service";
import { Action } from "./action.interface";

export const standardPassAction: Action = {
    name: 'STANDARD PASS',
    steps: [
        InitStandardPassingStep,
        SetStandardPassingPathStep,
        StandardPassBallStep
    ]
}