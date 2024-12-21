import { Injectable } from "@angular/core";
import { InitStandardPassingStep } from "../services/action-step/standard-pass/init-standard-passing.step";
import { SetStandardPassingPathStep } from "../services/action-step/standard-pass/set-standard-passing-path.step";
import { StandardPassBallStep } from "../services/action-step/standard-pass/standard-pass-ball.step";
import { Action } from "./classes/action.class";
import { IsLeftClick } from "./rules/is-left-click.rule";
import { HasThePlayerTheBall } from "./rules/pass/has-the-player-the-ball.rule";
import { RelocationIsInactive } from "./rules/relocation-is-inactive.rule";

@Injectable({
    providedIn: 'root',
})
export class StandardPassAction extends Action {

    constructor() {
        super()
        this.initSteps()
        this.setName('Standard Pass')        
    }

    initSteps() {
        this.addStep(InitStandardPassingStep)
        this.addStep(SetStandardPassingPathStep)
        this.addStep(StandardPassBallStep)
    }

    initRuleSet() {      
        this.addRule(new IsLeftClick())
        this.addRule(new HasThePlayerTheBall())
        this.addRule(new RelocationIsInactive())
      }
}