import { Injectable } from "@angular/core";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { SetMovingPathActionMeta } from "../../../actions/metas/set-moving-path.action.meta";
import { IsTheNextAction } from "../../../actions/rules/is-the-next-action.rule";
import { Store } from "@ngrx/store";
import { IsPickedPlayerClicked } from "../../../actions/rules/cancel-moving-player/is-picked-player-clicked.rule";
import { clearActionMeta } from "../../../stores/action/action.actions";
import { IsRightClick } from "../../../actions/rules/is-right-click.rule";
import { AtLeastOneRule } from "../../../actions/rules/at-least-one.rule";
import { AllOfThemRule } from "../../../actions/rules/all-of-them.rule";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";

@Injectable({
    providedIn: 'root',
})
export class CancelMovingPlayerAction implements ActionStrategy {
    ruleSet: ActionRuleSet;
    lastActionMeta!: SetMovingPathActionMeta;

    constructor(private store: Store) {
        this.ruleSet = new ActionRuleSet();   
        this.ruleSet.addRule(new IsTheNextAction(CancelMovingPlayerAction));    
        this.ruleSet.addRule(new AtLeastOneRule(
            new AllOfThemRule(new IsPickedPlayerClicked(), new IsLeftClick()), 
            new IsRightClick()
        )); 
    }

    identify(context: ActionContext): boolean {
        return this.ruleSet.validate(context);
    }

    calculation(context: ActionContext): void {

    }

    updateState(context: ActionContext): void {
        this.store.dispatch(clearActionMeta());
    }    
}