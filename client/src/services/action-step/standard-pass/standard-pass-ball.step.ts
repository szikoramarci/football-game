import { Injectable } from "@angular/core";
import { Step } from "../../../actions/classes/step.class";
import { IsTheNextStep } from "../../../actions/rules/is-the-next-step.rule";
import { Store } from "@ngrx/store";
import { clearCurrentAction, clearGameContext, clearActionMeta, setSelectableActions } from "../../../stores/action/action.actions";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";
import { moveBall } from "../../../stores/ball-position/ball-position.actions";
import { IsPassTargetHexClicked } from "../../../actions/rules/pass/is-pass-target-hex-clicked.rule";
import { StandardPassActionMeta } from "../../../actions/metas/standard-pass.action-meta";
import { ChallengeService } from "../../challenge/challenge.service";

@Injectable({
    providedIn: 'root',
})
export class StandardPassBallStep extends Step {
    actionMeta!: StandardPassActionMeta

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

    calculation(): void {
        this.actionMeta = {...this.context.actionMeta as StandardPassActionMeta}
    }

    updateState(): void {  
        const ballWasStolen = Array.from(this.actionMeta.challengeHexes!.entries()).some(([oppositionPlayerID]) => {
            if (this.challenge.dribbleTackleChallenge()) {
                this.challenge.transferBallToOpponent(oppositionPlayerID);                         
                this.challenge.switchActiveTeam(oppositionPlayerID)
                return true;
            }
            return false;
        });        

        if (!ballWasStolen) {
            this.store.dispatch(moveBall(this.context.hex));          
        }        

        this.store.dispatch(setSelectableActions({ actions: [] }))
        this.store.dispatch(clearActionMeta())                                
        this.store.dispatch(clearCurrentAction())      
        this.store.dispatch(clearGameContext())
    }    
}