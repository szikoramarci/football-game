import { Injectable } from "@angular/core";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { Store } from "@ngrx/store";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";

@Injectable({
    providedIn: 'root',
})
export class SetMovingPathAction implements ActionStrategy {
    ruleSet: ActionRuleSet;

    constructor(private store: Store) {
        this.ruleSet = new ActionRuleSet();        
    }

    identify(context: ActionContext): boolean {
        return this.ruleSet.validate(context);
    }

    calculation(context: ActionContext): void {
        console.log("Kalkulációk végrehajtása");
    }

    triggerVisual(context: ActionContext): void {
        console.log("Vizuális réteg frissítése: útvonal megjelenítése.");
    }

    updateState(context: ActionContext): void {
        //this.store.dispatch(triggerAction(pickUpPlayerActionMeta));
    }
}