import { Injectable } from "@angular/core";
import { Step } from "../../../action-steps/interfaces/step.interface";
import { StepRuleSet } from "../../../action-steps/interfaces/step-rule.interface";
import { StepContext } from "../../../action-steps/interfaces/step-context.interface";
import { SetMovingPathStepMeta } from "../../../action-steps/metas/moving/set-moving-path.step-meta";
import { IsTheNextStep } from "../../../action-steps/rules/is-the-next-step.rule";
import { Store } from "@ngrx/store";
import { IsPickedPlayerClicked } from "../../../action-steps/rules/cancel/is-picked-player-clicked.rule";
import { clearStepMeta } from "../../../stores/action/action.actions";
import { IsRightClick } from "../../../action-steps/rules/is-right-click.rule";
import { AtLeastOneRule } from "../../../action-steps/rules/at-least-one.rule";
import { AllOfThemRule } from "../../../action-steps/rules/all-of-them.rule";
import { IsLeftClick } from "../../../action-steps/rules/is-left-click.rule";

@Injectable({
    providedIn: 'root',
})
export class CancelStep implements Step {
    ruleSet: StepRuleSet;
    lastStepMeta!: SetMovingPathStepMeta;

    constructor(private store: Store) {
        this.ruleSet = new StepRuleSet();           
        this.ruleSet.addRule(new IsTheNextStep(CancelStep));    
        this.ruleSet.addRule(new AtLeastOneRule(
            new AllOfThemRule(new IsPickedPlayerClicked(), new IsLeftClick()), 
            new IsRightClick()
        )); 
    }

    identify(context: StepContext): boolean {
        return this.ruleSet.validate(context);
    }

    calculation(context: StepContext): void {

    }

    updateState(context: StepContext): void {
        this.store.dispatch(clearStepMeta());
    }    
}