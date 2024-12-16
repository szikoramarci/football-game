import { InitStandardPassingStep } from "../services/action-step/standard-pass/init-standard-passing/init-standard-passing.step.service";
import { SetStandardPassingPathStep } from "../services/action-step/standard-pass/set-standard-passing-path/set-standard-passing-path.step.service";
import { StandardPassBallStep } from "../services/action-step/standard-pass/standard-pass-ball/standard-pass-ball.step.service";
import { Action } from "./classes/action.class";
import { IsLeftClick } from "./rules/is-left-click.rule";
import { IsOwnPlayer } from "./rules/move/is-own-player.rule";
import { HasThePlayerTheBall } from "./rules/pass/has-the-player-the-ball.rule";

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
        this.addRule(new IsOwnPlayer())
        this.addRule(new HasThePlayerTheBall())
      }
}