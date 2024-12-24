import { Injectable, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { GameContext } from "./game-context.interface";
import { RuleEvaluator } from "./rule-evaluator.class";

@Injectable()
export abstract class Step extends RuleEvaluator implements OnDestroy {        
    private subscriptions: Subscription = new Subscription()      
    protected context!: GameContext  

    protected addSubscription(subscribtion: Subscription) {
        this.subscriptions.add(subscribtion)
    }    

    public setGameContext(context: GameContext) {
        this.context = context
    }
    
    abstract calculation(): void;
    abstract updateState(): void;

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe()
    }
}
  