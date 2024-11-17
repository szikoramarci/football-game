import { Injectable } from "@angular/core";
import { ActionStepStrategy } from "../../../action-steps/interfaces/action-step-strategy.interface";
import { ActionStepRuleSet } from "../../../action-steps/interfaces/action-step-rule.interface";
import { ActionStepContext } from "../../../action-steps/interfaces/action-step-context.interface";
import { SetMovingPathActionStepMeta } from "../../../action-steps/metas/moving/set-moving-path.action-step-meta";
import { IsTheNextActionStep } from "../../../action-steps/rules/is-the-next-action.rule";
import { IsMoveTargetHexClicked } from "../../../action-steps/rules/move/is-move-target-hex-clicked.rule";
import { Store } from "@ngrx/store";
import { clearActionStepMeta } from "../../../stores/action/action.actions";
import { movePlayer } from "../../../stores/player-position/player-position.actions";
import { equals, Grid, Hex, hexToOffset, OffsetCoordinates } from "honeycomb-grid";
import { IsLeftClick } from "../../../action-steps/rules/is-left-click.rule";
import { concatMap, delay, from, of, takeWhile } from "rxjs";
import { IsTargetHexNotThePlayerHex } from "../../../action-steps/rules/move/is-target-hex-not-the-player-hex.rule";
import { moveBall } from "../../../stores/ball-position/ball-position.actions";
import { ChallengeService } from "../../challenge/challenge.service";

const playerStepDelay: number = 300

@Injectable({
    providedIn: 'root',
})
export class MovePlayerActionStep implements ActionStepStrategy {
    ruleSet: ActionStepRuleSet
    lastActionStepMeta!: SetMovingPathActionStepMeta
    playerID!: string
    movingPath!: Grid<Hex>
    challengeHexes!: Map<string,Hex>

    constructor(
            private store: Store,
            private challenge: ChallengeService
        ) {
        this.ruleSet = new ActionStepRuleSet();   
        this.ruleSet.addRule(new IsLeftClick());
        this.ruleSet.addRule(new IsTheNextActionStep(MovePlayerActionStep));    
        this.ruleSet.addRule(new IsMoveTargetHexClicked()); 
        this.ruleSet.addRule(new IsTargetHexNotThePlayerHex()); 
    }

    identify(context: ActionStepContext): boolean {
        return this.ruleSet.validate(context);
    }

    calculation(context: ActionStepContext): void {
        this.lastActionStepMeta = context.lastActionStepMeta as SetMovingPathActionStepMeta;
        this.movingPath = this.lastActionStepMeta.movingPath;
        this.challengeHexes = this.lastActionStepMeta.challengeHexes
        if (this.lastActionStepMeta.playerID) {
            this.playerID = this.lastActionStepMeta.playerID
        } else {
            console.log("Invalid player.");
        }
    }

    updateState(): void {     
        this.store.dispatch(clearActionStepMeta())         
        from(this.movingPath.toArray())
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

    isBallStealSuccessfully(position: OffsetCoordinates) {
        if (!this.lastActionStepMeta.playerHasBall) {    
            return true;
        }

        const challengesOnHex = Array.from(this.challengeHexes.entries())
            .filter(([_, challengePosition]) => equals(challengePosition, position))
            .map(([oppositionPlayerID,_]) => oppositionPlayerID)

        for (const oppositionPlayerID of challengesOnHex) {
            this.challengeHexes.delete(oppositionPlayerID);

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
            playerID: this.playerID, 
            position: coordinates
        }));  
    }

    playerStepsAhead(nextHex: Hex) {
        const newCoordinates = hexToOffset(nextHex)                
        this.movePlayer(newCoordinates)      
        if (this.lastActionStepMeta.playerHasBall) {
            this.store.dispatch(moveBall(newCoordinates));
        }    
    }
}    