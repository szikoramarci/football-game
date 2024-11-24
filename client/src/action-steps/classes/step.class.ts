import { Injectable, OnDestroy } from "@angular/core";
import { StepRule, StepRuleSet } from "./step-rule.interface";
import { Subscription } from "rxjs";
import { StepContext } from "./step-context.interface";

@Injectable()
export abstract class Step implements OnDestroy {    
    private ruleSet: StepRuleSet = new StepRuleSet();
    private subscriptions: Subscription = new Subscription()

    protected addRule(rule: StepRule) {
        this.ruleSet.addRule(rule)
    }

    protected addSubscription(subscribtion: Subscription) {
        this.subscriptions.add(subscribtion)
    }

    identify(context: StepContext): boolean {
        return this.ruleSet.validate(context);
    }

    abstract initRuleSet(): void;
    abstract calculation(context: StepContext): void;
    abstract updateState(context: StepContext): void;

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe()
    }
}
  