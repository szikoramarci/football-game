import { Injectable, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { GameContext } from "./game-context.interface";
import { RuleEvaluator } from "./rule-evaluator.class";

@Injectable()
export abstract class Step extends RuleEvaluator implements OnDestroy {        
    private subscriptions: Subscription = new Subscription()    

    protected addSubscription(subscribtion: Subscription) {
        this.subscriptions.add(subscribtion)
    }    
    
    abstract calculation(context: GameContext): void;
    abstract updateState(context: GameContext): void;

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe()
    }
}
  