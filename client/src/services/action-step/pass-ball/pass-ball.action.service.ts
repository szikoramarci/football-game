import { Injectable } from "@angular/core";
import { ActionStepStrategy } from "../../../action-steps/interfaces/action-step-strategy.interface";
import { ActionStepRuleSet } from "../../../action-steps/interfaces/action-step-rule.interface";
import { ActionStepContext } from "../../../action-steps/interfaces/action-step-context.interface";
import { IsTheNextActionStep } from "../../../action-steps/rules/is-the-next-action.rule";
import { Store } from "@ngrx/store";
import { clearActionStepMeta } from "../../../stores/action/action.actions";
import { IsLeftClick } from "../../../action-steps/rules/is-left-click.rule";
import { moveBall } from "../../../stores/ball-position/ball-position.actions";
import { SetStandardPassingPathActionStep } from "../set-standard-passing-path/set-standard-passing-path.action.service";
import { IsPassTargetHexClicked } from "../../../action-steps/rules/pass/is-pass-target-hex-clicked.rule";
import { Hex } from "honeycomb-grid";
import { SetStandardPassingPathActionStepMeta } from "../../../action-steps/metas/passing/standard-passing/set-standard-passing-path.action-step-meta";
import { ChallengeService } from "../../challenge/challenge.service";

@Injectable({
    providedIn: 'root',
})
export class PassBallActionStep implements ActionStepStrategy {
    ruleSet: ActionStepRuleSet
    lastActionStepMeta!: SetStandardPassingPathActionStepMeta
    challengeHexes!: Map<string, Hex>

    constructor(
        private store: Store,
        private challenge: ChallengeService
    ) {
        this.ruleSet = new ActionStepRuleSet();   
        this.ruleSet.addRule(new IsLeftClick());
        this.ruleSet.addRule(new IsTheNextActionStep(SetStandardPassingPathActionStep));    
        this.ruleSet.addRule(new IsPassTargetHexClicked()); 
    }

    identify(context: ActionStepContext): boolean {
        return this.ruleSet.validate(context);
    }

    calculation(context: ActionStepContext): void {
        this.lastActionStepMeta = context.lastActionStepMeta as SetStandardPassingPathActionStepMeta
        this.challengeHexes = this.lastActionStepMeta.challengeHexes
    }

    updateState(context: ActionStepContext): void {  
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

        this.store.dispatch(clearActionStepMeta());    
    }    
}