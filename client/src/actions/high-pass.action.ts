import { InitHighPassingStep } from "../services/action-step/high-pass/init-high-passing/init-high-passing.step.service";
import { SetHighPassingPathStep } from "../services/action-step/high-pass/set-high-passing-path/set-high-passing-path.step.service";
import { Action } from "./classes/action.class";
import { IsLeftClick } from "./rules/is-left-click.rule";
import { IsOwnPlayer } from "./rules/move/is-own-player.rule";
import { HasThePlayerTheBall } from "./rules/pass/has-the-player-the-ball.rule";

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