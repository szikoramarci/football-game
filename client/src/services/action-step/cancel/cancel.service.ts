import { Injectable } from "@angular/core";
import { Step } from "../../../actions/classes/step.class";
import { GameContext } from "../../../actions/classes/game-context.interface";
import { SetMovingPathStepMeta } from "../../../actions/metas/moving/set-moving-path.step-meta";
import { IsTheNextStep } from "../../../actions/rules/is-the-next-step.rule";
import { Store } from "@ngrx/store";
import { IsPickedPlayerClicked } from "../../../actions/rules/cancel/is-picked-player-clicked.rule";
import { clearStepMeta } from "../../../stores/action/action.actions";
import { IsRightClick } from "../../../actions/rules/is-right-click.rule";
import { AtLeastOneRule } from "../../../actions/rules/at-least-one.rule";
import { AllOfThemRule } from "../../../actions/rules/all-of-them.rule";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";

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

    calculation(context: GameContext): void {}

    updateState(context: GameContext): void {
        this.store.dispatch(clearStepMeta());
    }    
}