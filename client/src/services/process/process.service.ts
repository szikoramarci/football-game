import { Injectable } from "@angular/core";
import { ProcessType } from "../../processes/process.type.enum";
import { ProcessRule } from "../../processes/process.rule.interface";
import { IsOwnPlayer } from "../../processes/rules/is-own-player.rule";
import { IsPlayer } from "../../processes/rules/is-player.rule";
import { IsAlreadyPicked } from "../../processes/rules/is-already-picked.rule";
import { IsEmpty } from "../../processes/rules/is-empty.rule";
import { IsNotPicked } from "../../processes/rules/is-not-picked.rule";

@Injectable({
    providedIn: 'root'
})
export class ProcessService {

    rules: { [key in ProcessType]?: ProcessRule[] } = {};

    constructor() {
        this.initPickPlayerProcess();
        this.initMovePlayerProcess();
    }

    initPickPlayerProcess(){
        this.addRule(ProcessType.PickPlayer, new IsPlayer());
        this.addRule(ProcessType.PickPlayer, new IsOwnPlayer());
        this.addRule(ProcessType.PickPlayer, new IsAlreadyPicked());
    }

    initMovePlayerProcess(){
        this.addRule(ProcessType.MovePlayer, new IsEmpty());
        this.addRule(ProcessType.MovePlayer, new IsNotPicked());
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