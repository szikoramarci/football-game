import { Injectable } from "@angular/core";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";
import { Step } from "../../../actions/classes/step.class";
import { MovingActionMeta } from "../../../actions/metas/moving.action-meta";
import { Store } from "@ngrx/store";
import { ChallengeService } from "../../challenge/challenge.service";
import { IsTheNextStep } from "../../../actions/rules/is-the-next-step.rule";
import { IsMoveTargetHexClicked } from "../../../actions/rules/move/is-move-target-hex-clicked.rule";
import { IsTargetHexNotThePlayerHex } from "../../../actions/rules/move/is-target-hex-not-the-player-hex.rule";
import { equals, Hex, hexToOffset, OffsetCoordinates } from "honeycomb-grid";
import { movePlayer } from "../../../stores/player-position/player-position.actions";
import { moveBall } from "../../../stores/ball-position/ball-position.actions";
import { clearActionMeta, clearCurrentAction, clearGameContext, setSelectableActions } from "../../../stores/action/action.actions";
import { concatMap, delay, from, of, takeWhile } from "rxjs";

const playerStepDelay: number = 300

@Injectable({
    providedIn: 'root',
})
export class MovePlayerStep extends Step {    
    actionMeta!: MovingActionMeta

    constructor(
            private store: Store,
            private challenge: ChallengeService
        ) {
        super()
        this.initRuleSet()        
    }

    initRuleSet(): void {
        this.addRule(new IsLeftClick());
        this.addRule(new IsTheNextStep(MovePlayerStep));    
        this.addRule(new IsMoveTargetHexClicked()); 
        this.addRule(new IsTargetHexNotThePlayerHex());    
    }

    calculation(): void {
        this.actionMeta = {...this.context.actionMeta as MovingActionMeta}
    }    

    isBallStealSuccessfully(position: OffsetCoordinates) {
        if (!this.actionMeta.playerHasBall) {    
            return true;
        }

        const challengesOnHex = Array.from(this.actionMeta.challengeHexes!.entries())
            .filter(([_, challengePosition]) => equals(challengePosition, position))
            .map(([oppositionPlayerID,_]) => oppositionPlayerID)

        for (const oppositionPlayerID of challengesOnHex) {
            this.actionMeta.challengeHexes!.delete(oppositionPlayerID);

            if (this.challenge.dribbleTackleChallenge()) {                                
                this.challenge.transferBallToOpponent(oppositionPlayerID, 2*playerStepDelay);
                this.challenge.switchActiveTeam(oppositionPlayerID)
                return false;
            }
        }
        
        return true;
    }     

    movePlayer(coordinates: OffsetCoordinates) {
        this.store.dispatch(movePlayer({
            playerID: this.actionMeta.playerID!, 
            position: coordinates
        }));  
    }

    playerStepsAhead(nextHex: Hex) {
        const newCoordinates = hexToOffset(nextHex)                
        this.movePlayer(newCoordinates)      
        if (this.actionMeta.playerHasBall) {
            this.store.dispatch(moveBall(newCoordinates));
        }    
    }

    updateState(): void {       
        this.store.dispatch(setSelectableActions({ actions: [] }))
        this.store.dispatch(clearActionMeta())                                
        this.store.dispatch(clearCurrentAction())      
        this.store.dispatch(clearGameContext())
        
        
        from(this.actionMeta.movingPath!.toArray())
            .pipe(                
                concatMap((position, index) => 
                    index === 0 
                        ? of(position)  // No delay for the first action
                        : of(position).pipe(delay(playerStepDelay)) // Delay for the rest
                ),
                takeWhile(newPosition => this.isBallStealSuccessfully(newPosition), true),            
            )
            .subscribe(nextHex => this.playerStepsAhead(nextHex))                  
    }    
}    