import { InitHighPassingStep } from "../services/action-step/high-pass/init-high-passing/init-high-passing.step.service";
import { SetHighPassingPathStep } from "../services/action-step/high-pass/set-high-passing-path/set-high-passing-path.step.service";
import { Action } from "./action.interface";

export const highPassAction: Action = {
    steps: [
        InitHighPassingStep,
        SetHighPassingPathStep,        
    ]
}