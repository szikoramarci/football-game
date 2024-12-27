import { Injectable } from "@angular/core";
import { Step } from "../../../actions/classes/step.class";
import { MovingActionMeta } from "../../../actions/metas/moving.action-meta";
import { Store } from "@ngrx/store";
import { ChallengeService } from "../../challenge/challenge.service";
import { IsTheNextStep } from "../../../actions/rules/is-the-next-step.rule";
import { equals, Hex,  OffsetCoordinates } from "honeycomb-grid";
import { movePlayer } from "../../../stores/player-position/player-position.actions";
import { moveBall } from "../../../stores/ball-position/ball-position.actions";
import { clearActionMeta, clearCurrentAction, clearGameContext, setSelectableActions } from "../../../stores/action/action.actions";
import { concatMap, delay, from, of, takeWhile } from "rxjs";
import { getBallPosition } from "../../../stores/ball-position/ball-position.selector";
import { getRelocationState } from "../../../stores/relocation/relocation.selector";
import { RelocationTurn } from "../../../relocation/relocation-turn.interface";
import { addUsedPlayer, initScenario, unshiftScenarioTurn } from "../../../stores/relocation/relocation.actions";
import { generateMovementPhase } from "../../../relocation/movement-phase.relocation";
import { Team } from "../../../models/team.enum";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";

const playerStepDelay: number = 300

@Injectable({
    providedIn: 'root',
})
export class MovePlayerStep extends Step {    
    actionMeta!: MovingActionMeta
    ballPosition!: OffsetCoordinates
    scenarioTurns!: RelocationTurn[]

    constructor(
            private store: Store,
            private challenge: ChallengeService
        ) {
        super()
        this.initRuleSet()  
        this.initSubscriptions()      
    }

    initRuleSet(): void {        
        this.addRule(new IsLeftClick);      
        this.addRule(new IsTheNextStep(MovePlayerStep));   
    }

    initSubscriptions() {
        const ballPositionSubscriptions = this.store.select(getBallPosition()).subscribe(ballPosition => {                        
            this.ballPosition = ballPosition as OffsetCoordinates
        })
        const relocationSubscriptions = this.store.select(getRelocationState).subscribe(scenario => {                        
            this.scenarioTurns = scenario.relocationTurns
        })
        this.addSubscription(relocationSubscriptions)
        this.addSubscription(ballPositionSubscriptions)
    }

    calculation(): void {
        this.actionMeta = {...this.context.actionMeta as MovingActionMeta}
        this.actionMeta.finalMovingPath = this.actionMeta.possibleMovingPath
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

    movePlayer(coordinates: Hex) {
        this.store.dispatch(movePlayer({
            playerID: this.actionMeta.player.id!, 
            position: coordinates
        }));  
    }
    
    checkAndPickUpBall(coordinates: Hex) {
        if (!this.actionMeta.playerHasBall && equals(coordinates, this.ballPosition)) {
            this.actionMeta.playerHasBall = true
        }
    }

    moveBall(coordinates: Hex) {
        if (this.actionMeta.playerHasBall) {
            this.store.dispatch(moveBall(coordinates));
        }
    }

    playerStepsAhead(nextHex: Hex) {                            
        this.movePlayer(nextHex)
        this.checkAndPickUpBall(nextHex)
        this.moveBall(nextHex)
    }

    countMovementStep() {        
        const playerID = this.actionMeta.player?.id || ""
        const playerTeam = this.actionMeta.player?.team || "" as Team

        if (this.scenarioTurns.length > 0) {
            this.store.dispatch(unshiftScenarioTurn())
        } else {
            const movementPhase = generateMovementPhase(playerTeam)            
            this.store.dispatch(initScenario({ turns: movementPhase }))
        }
        this.store.dispatch(addUsedPlayer({ playerID }))
    }

    updateState(): void {           

        this.store.dispatch(setSelectableActions({ actions: [] }))
        this.store.dispatch(clearActionMeta())                                
        this.store.dispatch(clearCurrentAction())      
        this.store.dispatch(clearGameContext())      
        
        this.countMovementStep()      
     
        from(this.actionMeta.finalMovingPath!.toArray())
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