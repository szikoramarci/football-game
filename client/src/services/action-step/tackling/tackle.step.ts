import { Injectable } from "@angular/core";
import { TacklingActionMeta } from "../../../actions/metas/tackling.action-meta";
import { Step } from "../../../actions/classes/step.class";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";
import { IsTheNextStep } from "../../../actions/rules/is-the-next-step.rule";
import { Store } from "@ngrx/store";
import { IsPossibleTacklingHexClicked } from "../../../actions/rules/tackle/is-possible-tackling-hex-clicked.rule";
import { concatMap, delay, from, map, of } from "rxjs";
import { movePlayer } from "../../../stores/player-position/player-position.actions";
import { TacklingHelperService } from "../../action-helper/tackling-helper.service";
import { ChallengeService } from "../../challenge/challenge.service";
import { moveBall } from "../../../stores/ball-position/ball-position.actions";
import { LooseBallService } from "../../loose-ball/loose-ball.service";
import { setAttackingTeam } from "../../../stores/gameplay/gameplay.actions";
import { addUsedPlayer, clearScenario, shiftScenarioTurn, unshiftScenarioTurn } from "../../../stores/relocation/relocation.actions";
import { clearActionMeta, clearCurrentAction, clearGameContext, clearSelectableActions, setLastEvent } from "../../../stores/action/action.actions";
import { generateAfterTackleRelocation } from "../../../relocation/after-tackle.relocation-turn";
import { PlayerService } from "../../player/player.service";
import { Hex, hexToOffset } from "@szikoramarci/honeycomb-grid";
import { TackleOutcome } from "../../../enums/tackle-outcome.enum";
import { Event } from "../../../enums/event.enum";

const playerStepDelay: number = 300

@Injectable({
  providedIn: 'root',
})
export class TackleStep extends Step {
    actionMeta!: TacklingActionMeta
    tackleOutcome!: TackleOutcome

    constructor(
        private store: Store,
        private tackleHelper: TacklingHelperService,
        private challange: ChallengeService,
        private looseBall: LooseBallService,
        private player: PlayerService
    ) {
        super()
        this.initRuleSet()
    }

    initRuleSet() {
        this.addRule(new IsLeftClick())
        this.addRule(new IsTheNextStep(TackleStep))
        this.addRule(new IsPossibleTacklingHexClicked())
    }

    calculation(): void {
        this.actionMeta = {...this.context.actionMeta as TacklingActionMeta}
    }

    movePlayer(coordinates: Hex) {
        this.store.dispatch(movePlayer({
            playerID: this.actionMeta.player.id!, 
            position: coordinates
        }));  
    }

    tacklePlayer(coordinates: Hex) {        
        this.tackleHelper.triggerTackleTrying(
            this.actionMeta.player.id!,
            coordinates
        )
    }

    performTacklingChallange() {
        const tackler = this.actionMeta.player
        const dribbler = this.actionMeta.ballerPlayer
        this.tackleOutcome = this.challange.tacklingChallange(tackler, dribbler)        
        // TODO handling fouls
    }

    generateRelocationTurn() {    
        const { ballerPlayer, opponentPlayer } = this.getPlayersBasedOnOutcome()

        if (!ballerPlayer || !opponentPlayer) {
            return
        }
                         
        if (ballerPlayer && opponentPlayer) {
            this.player.getFreeAdjacentHexesByPlayerID(opponentPlayer.id).subscribe(adjacentHexes => {   
                const relocationTurn = generateAfterTackleRelocation(ballerPlayer, adjacentHexes)
                this.store.dispatch(unshiftScenarioTurn({ relocationTurn }))
            })    
        }            
    }

    getPlayersBasedOnOutcome() {
        const tackler = this.actionMeta.player
        const dribbler = this.actionMeta.ballerPlayer
    
        if (this.tackleOutcome === TackleOutcome.TACKLER_WINS) {
            return { ballerPlayer: tackler, opponentPlayer: dribbler }
        }
    
        if (this.tackleOutcome === TackleOutcome.DRIBBLER_WINS) {
            return { ballerPlayer: dribbler, opponentPlayer: tackler }
        }
    
        return { ballerPlayer: null, opponentPlayer: null }
    }

    handleLooseBall() {
        if (this.tackleOutcome === TackleOutcome.LOOSING_BALL) {
            this.looseBall.loosingBall(this.actionMeta.ballHex)
        }
    }

    handleTacklerWins() {        
        if (this.tackleOutcome === TackleOutcome.TACKLER_WINS) {
            console.log('TACKLER WINS')     
            const tackler = this.actionMeta.player           
            this.store.dispatch(setAttackingTeam({ attackingTeam: tackler.team }))
            this.store.dispatch(clearScenario())
            this.store.dispatch(setLastEvent({ event: Event.SUCCESSFUL_TACKLE }))
        } 
    }

    handleDribblerWins() {
        if (this.tackleOutcome === TackleOutcome.DRIBBLER_WINS) {
            console.log('DRIBBLER WINS')  
        }
    }

    handleBallMovement() {
        if (this.tackleOutcome === TackleOutcome.TACKLER_WINS) {
            this.store.dispatch(moveBall(hexToOffset(this.context.hex)))
        }   
    }

    updateState(): void {
        const movingPath = this.actionMeta.movingPath!.toArray()  

        this.store.dispatch(shiftScenarioTurn())
        this.store.dispatch(addUsedPlayer({ playerID: this.actionMeta.player.id })) 
        
        this.performTacklingChallange()                
        this.handleTacklerWins()
        this.handleDribblerWins()

        this.store.dispatch(clearSelectableActions())                                   
        this.store.dispatch(clearCurrentAction())      
        this.store.dispatch(clearGameContext()) 
        this.store.dispatch(clearActionMeta())                  

        from(movingPath)
            .pipe(                
                concatMap((position, index) => 
                    index === 0 
                        ? of(position)  // No delay for the first action
                        : of(position).pipe(delay(playerStepDelay)) // Delay for the rest
                ),          
                map((position, index) => {
                    return {
                        position,
                        index
                    }
                })
            )
            .subscribe(({position, index}) => {
                if (index === movingPath.length - 1) {
                    this.tacklePlayer(position); // Handle the last hex differently    
                    this.handleBallMovement()             
                    this.handleLooseBall()
                    this.generateRelocationTurn()
                } else {
                    this.movePlayer(position)
                }                
            });
    }
}