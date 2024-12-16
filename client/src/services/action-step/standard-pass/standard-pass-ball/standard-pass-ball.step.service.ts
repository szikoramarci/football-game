import { Injectable } from "@angular/core";
import { Step } from "../../../../actions/classes/step.class";
import { GameContext } from "../../../../actions/classes/game-context.interface";
import { IsTheNextStep } from "../../../../actions/rules/is-the-next-step.rule";
import { Store } from "@ngrx/store";
import { clearStepMeta } from "../../../../stores/action/action.actions";
import { IsLeftClick } from "../../../../actions/rules/is-left-click.rule";
import { moveBall } from "../../../../stores/ball-position/ball-position.actions";
import { IsPassTargetHexClicked } from "../../../../actions/rules/pass/is-pass-target-hex-clicked.rule";
import { Hex } from "honeycomb-grid";
import { SetStandardPassingPathStepMeta } from "../../../../actions/metas/passing/standard-passing/set-standard-passing-path.step-meta";
import { ChallengeService } from "../../../challenge/challenge.service";

@Injectable({
    providedIn: 'root',
})
export class StandardPassBallStep extends Step {
    lastStepMeta!: SetStandardPassingPathStepMeta
    challengeHexes!: Map<string, Hex>

    constructor(
        private store: Store,
        private challenge: ChallengeService
    ) {
        super()
        this.initRuleSet()
    }

    initRuleSet(): void {
        this.addRule(new IsLeftClick());
        this.addRule(new IsTheNextStep(StandardPassBallStep));    
        this.addRule(new IsPassTargetHexClicked()); 
    }

    calculation(context: GameContext): void {
        this.lastStepMeta = context.lastStepMeta as SetStandardPassingPathStepMeta
        this.challengeHexes = this.lastStepMeta.challengeHexes
    }

    updateState(context: GameContext): void {  
        const ballWasStolen = Array.from(this.challengeHexes.entries()).some(([oppositionPlayerID]) => {
            if (this.challenge.dribbleTackleChallenge()) {
                this.challenge.transferBallToOpponent(oppositionPlayerID);                         
                this.challenge.switchActiveTeam(oppositionPlayerID)
                return true;
            }
            return false;
        });        

        if (!ballWasStolen) {
            this.store.dispatch(moveBall(context.hex));          
        }        

        this.store.dispatch(clearStepMeta());    
    }    
}