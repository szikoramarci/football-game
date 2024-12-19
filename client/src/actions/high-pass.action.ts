import { Injectable } from "@angular/core";
import { InitHighPassingStep } from "../services/action-step/high-pass/init-high-passing.step";
import { SetHighPassingPathStep } from "../services/action-step/high-pass/set-high-passing-path.step";
import { Action } from "./classes/action.class";
import { IsLeftClick } from "./rules/is-left-click.rule";
import { IsOwnPlayer } from "./rules/move/is-own-player.rule";
import { HasThePlayerTheBall } from "./rules/pass/has-the-player-the-ball.rule";

@Injectable({
    providedIn: 'root',
})
export class HighPassAction extends Action {

    constructor() {
        super()
        this.initSteps()
        this.setName('High Pass')        
    }

    initSteps() {
        this.addStep(InitHighPassingStep)
        this.addStep(SetHighPassingPathStep)
    }

    initRuleSet() {      
        this.addRule(new IsLeftClick())
        this.addRule(new IsOwnPlayer())
        this.addRule(new HasThePlayerTheBall())
      }
}