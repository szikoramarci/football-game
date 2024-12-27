import { Injectable } from "@angular/core";
import { Action } from "./classes/action.class";
import { InitTacklingStep } from "../services/action-step/tackling/init-tackling.step";
import { CanPlayerTackle } from "./rules/tackle/can-player-tackle.rule";
import { IsLeftClick } from "./rules/is-left-click.rule";

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
        this.addRule(new IsLeftClick()) 
        this.addRule(new CanPlayerTackle())
      }
}