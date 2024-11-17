import { Injectable } from "@angular/core";
import { ActionStepStrategy } from "../../../action-steps/interfaces/action-step-strategy.interface";
import { ActionStepRuleSet } from "../../../action-steps/interfaces/action-step-rule.interface";
import { ActionStepContext } from "../../../action-steps/interfaces/action-step-context.interface";
import { SetMovingPathActionStepMeta } from "../../../action-steps/metas/moving/set-moving-path.action-step-meta";
import { IsTheNextActionStep } from "../../../action-steps/rules/is-the-next-action.rule";
import { Store } from "@ngrx/store";
import { IsPickedPlayerClicked } from "../../../action-steps/rules/cancel/is-picked-player-clicked.rule";
import { clearActionStepMeta } from "../../../stores/action/action.actions";
import { IsRightClick } from "../../../action-steps/rules/is-right-click.rule";
import { AtLeastOneRule } from "../../../action-steps/rules/at-least-one.rule";
import { AllOfThemRule } from "../../../action-steps/rules/all-of-them.rule";
import { IsLeftClick } from "../../../action-steps/rules/is-left-click.rule";

@Injectable({
    providedIn: 'root',
})
export class CancelActionStep implements ActionStepStrategy {
    ruleSet: ActionStepRuleSet;
    lastActionStepMeta!: SetMovingPathActionStepMeta;

    constructor(private store: Store) {
        this.ruleSet = new ActionStepRuleSet();           
        this.ruleSet.addRule(new IsTheNextActionStep(CancelActionStep));    
        this.ruleSet.addRule(new AtLeastOneRule(
            new AllOfThemRule(new IsPickedPlayerClicked(), new IsLeftClick()), 
            new IsRightClick()
        )); 
    }

    identify(context: ActionStepContext): boolean {
        return this.ruleSet.validate(context);
    }

    calculation(context: ActionStepContext): void {

    }

    updateState(context: ActionStepContext): void {
        this.store.dispatch(clearActionStepMeta());
    }    
}