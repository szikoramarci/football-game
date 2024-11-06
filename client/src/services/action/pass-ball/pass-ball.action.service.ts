import { Injectable } from "@angular/core";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { IsTheNextAction } from "../../../actions/rules/is-the-next-action.rule";
import { Store } from "@ngrx/store";
import { clearActionMeta } from "../../../stores/action/action.actions";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";
import { moveBall } from "../../../stores/ball-position/ball-position.actions";
import { SetPassingPathAction } from "../set-passing-path/set-passing-path.action.service";
import { IsPassTargetHexClicked } from "../../../actions/rules/pass/is-pass-target-hex-clicked.rule";
import { Hex } from "honeycomb-grid";
import { SetPassingPathActionMeta } from "../../../actions/metas/set-standard-passing-path.action.meta";
import { ChallengeService } from "../../challenge/challenge.service";

@Injectable({
    providedIn: 'root',
})
export class PassBallAction implements ActionStrategy {
    ruleSet: ActionRuleSet
    lastActionMeta!: SetPassingPathActionMeta
    challengeHexes!: Map<string, Hex>

    constructor(
        private store: Store,
        private challenge: ChallengeService
    ) {
        this.ruleSet = new ActionRuleSet();   
        this.ruleSet.addRule(new IsLeftClick());
        this.ruleSet.addRule(new IsTheNextAction(SetPassingPathAction));    
        this.ruleSet.addRule(new IsPassTargetHexClicked()); 
    }

    identify(context: ActionContext): boolean {
        return this.ruleSet.validate(context);
    }

    calculation(context: ActionContext): void {
        this.lastActionMeta = context.lastActionMeta as SetPassingPathActionMeta
        this.challengeHexes = this.lastActionMeta.challengeHexes
    }

    updateState(context: ActionContext): void {  
        const ballWasStolen = Array.from(this.challengeHexes.entries()).some(([oppositionPlayerID]) => {
            if (this.challenge.dribbleTackleChallenge()) {
                this.challenge.transferBallToOpponent(oppositionPlayerID);                         
                this.challenge.switchActiveTeam(oppositionPlayerID)
                return true;
            }
            return false;
        });        

        if (!ballWasStolen) {
            this.store.dispatch(moveBall(context.coordinates));          
        }        

        this.store.dispatch(clearActionMeta());    
    }    
}