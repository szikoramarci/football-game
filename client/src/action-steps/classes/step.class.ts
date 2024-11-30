import { Injectable, OnDestroy } from "@angular/core";
import { StepRule, StepRuleSet } from "./step-rule.interface";
import { Subscription } from "rxjs";
import { ActionContext } from "./action-context.interface";

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

    identify(context: ActionContext): boolean {
        return this.ruleSet.validate(context);
    }

    abstract initRuleSet(): void;
    abstract calculation(context: ActionContext): void;
    abstract updateState(context: ActionContext): void;

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe()
    }
}
  