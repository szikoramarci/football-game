import { Injectable } from "@angular/core";
import { Action } from "./classes/action.class";
import { IsLeftClick } from "./rules/is-left-click.rule";
import { IsPlayerRelocatable } from "./rules/relocate/is-player-relocatable.rule";

@Injectable({
    providedIn: 'root',
})
export class RelocateAction extends Action {

    constructor() {
        super()
        this.initSteps()
        this.setName('Relocate')        
    }

    initSteps() {
    }

    initRuleSet() {      
        this.addRule(new IsLeftClick())        
        this.addRule(new IsPlayerRelocatable())
    }
}