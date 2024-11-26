import { InitMovingStep } from "../services/action-step/moving/init-moving/init-moving.step.service";
import { MovePlayerStep } from "../services/action-step/moving/move-player/move-player.step.service";
import { SetMovingPathStep } from "../services/action-step/moving/set-moving-path/set-moving-path.step.service";
import { Action } from "./action.interface";

export const movingAction: Action = {
    steps: [
        InitMovingStep,
        SetMovingPathStep,
        MovePlayerStep
    ]
}
