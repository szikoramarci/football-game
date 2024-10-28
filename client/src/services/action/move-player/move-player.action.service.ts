import { Injectable } from "@angular/core";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { SetMovingPathActionMeta } from "../../../actions/metas/set-moving-path.action.meta";
import { IsTheNextAction } from "../../../actions/rules/is-the-next-action.rule";
import { IsMoveTargetHexClicked } from "../../../actions/rules/move/is-move-target-hex-clicked.rule";
import { Store } from "@ngrx/store";
import { clearActionMeta } from "../../../stores/action/action.actions";
import { movePlayer } from "../../../stores/player-position/player-position.actions";
import { equals, Grid, Hex, hexToOffset, OffsetCoordinates } from "honeycomb-grid";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";
import { concatMap, delay, from, of, take, takeWhile } from "rxjs";
import { IsTargetHexNotThePlayerHex } from "../../../actions/rules/move/is-target-hex-not-the-player-hex.rule";
import { moveBall } from "../../../stores/ball-position/ball-position.actions";
import { ChallengeService } from "../../challenge/challenge.service";
import { getPlayerPosition } from "../../../stores/player-position/player-position.selector";
import { getPlayer } from "../../../stores/player/player.selector";
import { setActiveTeam } from "../../../stores/gameplay/gameplay.actions";

const playerStepDelay: number = 300

@Injectable({
    providedIn: 'root',
})
export class MovePlayerAction implements ActionStrategy {
    ruleSet: ActionRuleSet
    lastActionMeta!: SetMovingPathActionMeta
    playerID!: string
    movingPath!: Grid<Hex>
    challengeHexes!: Map<string,Hex>

    constructor(
            private store: Store,
            private challenge: ChallengeService
        ) {
        this.ruleSet = new ActionRuleSet();   
        this.ruleSet.addRule(new IsLeftClick());
        this.ruleSet.addRule(new IsTheNextAction(MovePlayerAction));    
        this.ruleSet.addRule(new IsMoveTargetHexClicked()); 
        this.ruleSet.addRule(new IsTargetHexNotThePlayerHex()); 
    }

    identify(context: ActionContext): boolean {
        return this.ruleSet.validate(context);
    }

    calculation(context: ActionContext): void {
        this.lastActionMeta = context.lastActionMeta as SetMovingPathActionMeta;
        this.movingPath = this.lastActionMeta.movingPath;
        this.challengeHexes = this.lastActionMeta.challengeHexes
        if (this.lastActionMeta.playerID) {
            this.playerID = this.lastActionMeta.playerID
        } else {
            console.log("Invalid player.");
        }
    }

    updateState(): void {     
        this.store.dispatch(clearActionMeta())         
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
        if (!this.lastActionMeta.playerHasBall) {    
            return true;
        }

        const challengesOnHex = Array.from(this.challengeHexes.entries())
                                .filter(([_, challengePosition]) => equals(challengePosition, position))
                                .map(([oppositionPlayerID,_]) => oppositionPlayerID)

        for (const oppositionPlayerID of challengesOnHex) {
            this.challengeHexes.delete(oppositionPlayerID);

            if (this.challenge.dribbleTackleChallenge()) {                                
                this.transferBallToOpponent(oppositionPlayerID);
                this.switchActiveTeam(oppositionPlayerID)
                return false;
            }
        }
        
        return true;
    }

    transferBallToOpponent(oppositionPlayerID: string) {
        this.store.select(getPlayerPosition(oppositionPlayerID))
            .pipe(
                take(1),
                delay(2*playerStepDelay)
            )
            .subscribe(playerPosition => {
                this.store.dispatch(moveBall(playerPosition))
            })        
    }

    switchActiveTeam(oppositionPlayerID: string) {
        this.store.select(getPlayer(oppositionPlayerID))
            .pipe(
                take(1)
            )
            .subscribe(player => {
                this.store.dispatch(setActiveTeam({ activeTeam: player.team }))
            })
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
        if (this.lastActionMeta.playerHasBall) {
            this.store.dispatch(moveBall(newCoordinates));
        }    
    }
}    