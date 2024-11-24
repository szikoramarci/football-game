import { Injectable } from "@angular/core";
import { Step } from "../../../../action-steps/classes/step.class";
import { StepContext } from "../../../../action-steps/classes/step-context.interface";
import { SetMovingPathStepMeta } from "../../../../action-steps/metas/moving/set-moving-path.step-meta";
import { IsTheNextStep } from "../../../../action-steps/rules/is-the-next-step.rule";
import { IsMoveTargetHexClicked } from "../../../../action-steps/rules/move/is-move-target-hex-clicked.rule";
import { Store } from "@ngrx/store";
import { clearStepMeta } from "../../../../stores/action/action.actions";
import { movePlayer } from "../../../../stores/player-position/player-position.actions";
import { equals, Grid, Hex, hexToOffset, OffsetCoordinates } from "honeycomb-grid";
import { IsLeftClick } from "../../../../action-steps/rules/is-left-click.rule";
import { concatMap, delay, from, of, takeWhile } from "rxjs";
import { IsTargetHexNotThePlayerHex } from "../../../../action-steps/rules/move/is-target-hex-not-the-player-hex.rule";
import { moveBall } from "../../../../stores/ball-position/ball-position.actions";
import { ChallengeService } from "../../../challenge/challenge.service";

const playerStepDelay: number = 300

@Injectable({
    providedIn: 'root',
})
export class MovePlayerStep extends Step {    
    lastStepMeta!: SetMovingPathStepMeta
    playerID!: string
    movingPath!: Grid<Hex>
    challengeHexes!: Map<string,Hex>

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

    calculation(context: StepContext): void {
        this.lastStepMeta = context.lastStepMeta as SetMovingPathStepMeta;
        this.movingPath = this.lastStepMeta.movingPath;
        this.challengeHexes = this.lastStepMeta.challengeHexes
        if (this.lastStepMeta.playerID) {
            this.playerID = this.lastStepMeta.playerID
        } else {
            console.log("Invalid player.");
        }
    }    

    isBallStealSuccessfully(position: OffsetCoordinates) {
        if (!this.lastStepMeta.playerHasBall) {    
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
        if (this.lastStepMeta.playerHasBall) {
            this.store.dispatch(moveBall(newCoordinates));
        }    
    }

    updateState(): void {     
        this.store.dispatch(clearStepMeta())         
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
}    