import { Injectable } from "@angular/core";
import { Action } from "./classes/action.class";
import { IsLeftClick } from "./rules/is-left-click.rule";
import { HasThePlayerTheBall } from "./rules/pass/has-the-player-the-ball.rule";
import { RelocationIsInactive } from "./rules/relocation-is-inactive.rule";
import { InitTacklingStep } from "../services/action-step/tackling/init-tackling.step";
import { RelocationIsActive } from "./rules/relocation-is-active.rule";

@Injectable({
    providedIn: 'root',
})
export class TacklingAction extends Action {

    constructor() {
        super()
        this.initSteps()
        this.setName('Tackling')        
    }

    initSteps() {
        this.addStep(InitTacklingStep)
    }

    initRuleSet() {              
        this.addRule(new RelocationIsActive())
      }
}