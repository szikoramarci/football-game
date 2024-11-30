import { Injectable } from "@angular/core";
import { Step } from "../../../action-steps/classes/step.class";
import { ActionContext } from "../../../action-steps/classes/action-context.interface";
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
export class CancelStep extends Step {
    lastStepMeta!: SetMovingPathStepMeta;

    constructor(private store: Store) {
        super()    
    }

    initRuleSet() {          
        this.addRule(new IsTheNextStep(CancelStep));    
        this.addRule(new AtLeastOneRule(
            new AllOfThemRule(new IsPickedPlayerClicked(), new IsLeftClick()), 
            new IsRightClick()
        ));   
    }

    calculation(context: ActionContext): void {}

    updateState(context: ActionContext): void {
        this.store.dispatch(clearStepMeta());
    }    
}