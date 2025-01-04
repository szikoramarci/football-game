import { Injectable } from "@angular/core";
import { Action } from "./classes/action.class";
import { IsLeftClick } from "./rules/is-left-click.rule";
import { IsPlayerRelocatable } from "./rules/relocate/is-player-relocatable.rule";
import { InitRelocationStep } from "../services/action-step/relocation/init-relocation.step";
import { RelocatePlayerStep } from "../services/action-step/relocation/relocate-player.step";
import { SetRelocationHexStep } from "../services/action-step/relocation/set-relocation-hex.step";

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
        this.addStep(SetRelocationHexStep)
        this.addStep(RelocatePlayerStep)
    }

    initRuleSet() {      
        this.addRule(new IsLeftClick())        
        this.addRule(new IsPlayerRelocatable())
    }
}