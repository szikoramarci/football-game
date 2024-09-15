import { Injectable } from "@angular/core";
import { ProcessType } from "../../rules/process.type.enum";
import { ProcessRule } from "../../rules/process.rule.interface";
import { IsOwnPlayer } from "../../rules/pick-player/is-own-player.rule";

@Injectable({
    providedIn: 'root'
})
export class ProcessService {

    rules: { [key in ProcessType]?: ProcessRule[] } = {};

    constructor() {
        this.initPickPlayerProcess();
    }

    initPickPlayerProcess(){
        this.addRule(ProcessType.PickPlayer, new IsOwnPlayer())
    }

    addRule(type: ProcessType, rule: ProcessRule): void {
        if (!this.rules[type]) {
          this.rules[type] = [];
        }
        this.rules[type]?.push(rule);
    }

    validate(processType: ProcessType, context: any): boolean {
        const processRules = this.rules[processType];
        if (!processRules) {
          return true;
        }
    
        const errors = processRules
            .filter(rule => !rule.isValid(context))
            .map(rule => {
                console.log(rule.errorMessage)
                return rule;
            })
    
        return errors.length === 0;
      }
}