import { Injectable } from "@angular/core";
import { InitMovingStep } from "../services/action-step/moving/init-moving.step";
import { SetMovingPathStep } from "../services/action-step/moving/set-moving-path.step";
import { Action } from "./classes/action.class";
import { IsLeftClick } from "./rules/is-left-click.rule";
import { IsOwnPlayer } from "./rules/move/is-own-player.rule";
import { MovePlayerStep } from "../services/action-step/moving/move-player.step";

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
        this.addStep(SetMovingPathStep)
        this.addStep(MovePlayerStep)
    }

    initRuleSet() {      
        this.addRule(new IsLeftClick())
        this.addRule(new IsOwnPlayer())
      }
}