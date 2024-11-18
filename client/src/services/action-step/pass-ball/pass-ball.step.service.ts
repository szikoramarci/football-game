import { Injectable } from "@angular/core";
import { Step } from "../../../action-steps/interfaces/step.interface";
import { StepRuleSet } from "../../../action-steps/interfaces/step-rule.interface";
import { StepContext } from "../../../action-steps/interfaces/step-context.interface";
import { IsTheNextStep } from "../../../action-steps/rules/is-the-next-step.rule";
import { Store } from "@ngrx/store";
import { clearStepMeta } from "../../../stores/action/action.actions";
import { IsLeftClick } from "../../../action-steps/rules/is-left-click.rule";
import { moveBall } from "../../../stores/ball-position/ball-position.actions";
import { SetStandardPassingPathStep } from "../set-standard-passing-path/set-standard-passing-path.step.service";
import { IsPassTargetHexClicked } from "../../../action-steps/rules/pass/is-pass-target-hex-clicked.rule";
import { Hex } from "honeycomb-grid";
import { SetStandardPassingPathStepMeta } from "../../../action-steps/metas/passing/standard-passing/set-standard-passing-path.step-meta";
import { ChallengeService } from "../../challenge/challenge.service";

@Injectable({
    providedIn: 'root',
})
export class PassBallStep implements Step {
    ruleSet: StepRuleSet
    lastStepMeta!: SetStandardPassingPathStepMeta
    challengeHexes!: Map<string, Hex>

    constructor(
        private store: Store,
        private challenge: ChallengeService
    ) {
        this.ruleSet = new StepRuleSet();   
        this.ruleSet.addRule(new IsLeftClick());
        this.ruleSet.addRule(new IsTheNextStep(SetStandardPassingPathStep));    
        this.ruleSet.addRule(new IsPassTargetHexClicked()); 
    }

    identify(context: StepContext): boolean {
        return this.ruleSet.validate(context);
    }

    calculation(context: StepContext): void {
        this.lastStepMeta = context.lastStepMeta as SetStandardPassingPathStepMeta
        this.challengeHexes = this.lastStepMeta.challengeHexes
    }

    updateState(context: StepContext): void {  
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

        this.store.dispatch(clearStepMeta());    
    }    
}