import { Injectable } from "@angular/core";
import { Action } from "./classes/action.class";
import { IsLeftClick } from "./rules/is-left-click.rule";
import { IsPlayerRelocatable } from "./rules/relocate/is-player-relocatable.rule";
import { InitRelocationStep } from "../services/action-step/relocation/init-relocation";
import { RelocatePlayerStep } from "../services/action-step/relocation/relocate-player";

@Injectable({
    providedIn: 'root',
})
export class RelocationAction extends Action {

    constructor() {
        super()
        this.initSteps()
        this.setName('Relocate')        
    }

    initSteps() {
        this.addStep(InitRelocationStep)
        this.addStep(RelocatePlayerStep)
    }

    initRuleSet() {      
        this.addRule(new IsLeftClick())        
        this.addRule(new IsPlayerRelocatable())
    }
}