import { Injectable } from "@angular/core";
import { InitMovingStep } from "../services/action-step/moving/init-moving.step";
import { FindMovingPathStep } from "../services/action-step/moving/find-moving-path.step";
import { Action } from "./classes/action.class";
import { IsLeftClick } from "./rules/is-left-click.rule";
import { MovePlayerStep } from "../services/action-step/moving/move-player.step";
import { IsPlayerMovable } from "./rules/move/is-player-movable.rule";
import { SetMovingPathPointStep } from "../services/action-step/moving/set-moving-path-point.step.";

@Injectable({
    providedIn: 'root',
})
export class MovingAction extends Action {

    constructor() {
        super()
        this.initSteps()
        this.setName('Moving')        
    }

    initSteps() {
        this.addStep(InitMovingStep)
        this.addStep(FindMovingPathStep)
        this.addStep(SetMovingPathPointStep)
        this.addStep(MovePlayerStep)
    }

    initRuleSet() {      
        this.addRule(new IsLeftClick())        
        this.addRule(new IsPlayerMovable())
      }
}