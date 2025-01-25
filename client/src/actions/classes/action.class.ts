import { Injectable, Type } from "@angular/core";
import { RuleEvaluator } from "./rule-evaluator.class";
import { Step } from "./step.class";

@Injectable()
export abstract class Action extends RuleEvaluator {        
    protected name: string = ""
    protected steps: Type<Step>[] = []
    
    setName(name: string) {
        this.name = name
    }

    getName(): string {
        return this.name
    }

    addStep(step: Type<Step>) {
        this.steps.push(step)
    }

    getSteps(): Type<Step>[] {
        return this.steps
    }
}