import { Injectable } from "@angular/core";
import { Step } from "../../../actions/classes/step.class";

@Injectable({
  providedIn: 'root',
})
export class InitTacklingStep extends Step {

    constructor() {
        console.log('InitTacklingStep')
        super()
        this.initRuleSet()
    }

    initRuleSet() {
        
    }

    calculation(): void {
       
    }
    
    updateState(): void {

    }
    
}