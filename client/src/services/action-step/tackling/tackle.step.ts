import { Injectable } from "@angular/core";
import { TacklingActionMeta } from "../../../actions/metas/tackling.action-meta";
import { Step } from "../../../actions/classes/step.class";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";
import { IsTheNextStep } from "../../../actions/rules/is-the-next-step.rule";
import { Store } from "@ngrx/store";
import { IsPossibleTacklingHexClicked } from "../../../actions/rules/tackle/is-possible-tackling-hex-clicked.rule";
import { concatMap, delay, from, map, of } from "rxjs";
import { movePlayer } from "../../../stores/player-position/player-position.actions";
import { Hex } from "honeycomb-grid";
import { TacklingHelperService } from "../../action-helper/tackling-helper.service";
import { ChallengeService } from "../../challenge/challenge.service";
import { moveBall } from "../../../stores/ball-position/ball-position.actions";
import { LooseBallService } from "../../loose-ball/loose-ball.service";
import { setAttackingTeam } from "../../../stores/gameplay/gameplay.actions";
import { addUsedPlayer, clearScenario, shiftScenarioTurn, unshiftScenarioTurn } from "../../../stores/relocation/relocation.actions";
import { clearActionMeta, clearCurrentAction, clearGameContext, setAvailableActions, setSelectableActions } from "../../../stores/action/action.actions";
import { StandardPassAction } from "../../../actions/standard-pass.action";
import { HighPassAction } from "../../../actions/high-pass.action";
import { MovingAction } from "../../../actions/moving.action";
import { TacklingAction } from "../../../actions/tackling.action";
import { LongBallAction } from "../../../actions/long-ball.action";
import { SnapshotAction } from "../../../actions/snapshot.action";
import { generateAfterTackleRelocation } from "../../../relocation/after-tackle.relocation-turn";
import { TraverserService } from "../../traverser/traverser.service";
import { PlayerService } from "../../player/player.service";
import { RelocationAction } from "../../../actions/relocation.action";

const playerStepDelay: number = 300

@Injectable({
  providedIn: 'root',
})
export class TackleStep extends Step {
    actionMeta!: TacklingActionMeta;

    constructor(
        private store: Store,
        private tackleHelper: TacklingHelperService,
        private challange: ChallengeService,
        private looseBall: LooseBallService,
        private traverser: TraverserService,
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
        this.generateTacklerAdjacentHexes()
    }

    generateTacklerAdjacentHexes() {
        this.player.getFreeAdjacentHexesByHex(this.context.hex).subscribe(adjacentHexes => {
          this.actionMeta.tacklerAdjacentHexes = adjacentHexes
        })
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

    isTacklingChallangeSuccessful() {
        const tackler = this.actionMeta.player
        const dribbler = this.actionMeta.ballerPlayer
        const challangeResult = this.challange.tacklingChallange(tackler, dribbler)
        // TODO - foul 

       if (challangeResult == null) {
            console.log('LOOSING BALL')
            this.looseBall.loosingBall(this.actionMeta.ballHex)
            return null
        } else {
            if (challangeResult) {
                console.log('TACKLER WINS')                
                this.store.dispatch(setAttackingTeam({ attackingTeam: tackler.team }))
                this.store.dispatch(clearScenario())
                this.store.dispatch(setAvailableActions({
                    actions: [
                        RelocationAction,
                        MovingAction, 
                        TacklingAction, 
                        StandardPassAction, 
                        HighPassAction, 
                        LongBallAction, 
                        SnapshotAction
                    ]
                }))
                this.store.dispatch(unshiftScenarioTurn({ 
                    relocationTurn: generateAfterTackleRelocation(
                        tackler,
                        this.actionMeta.ballerAdjacentHexes
                    )
                }))
                return true
            } else {
                this.store.dispatch(unshiftScenarioTurn({ 
                    relocationTurn: generateAfterTackleRelocation(
                        dribbler,
                        this.actionMeta.tacklerAdjacentHexes!
                    )
                }))
                return false
            }
        }
        
    }

    updateState(): void {
        const movingPath = this.actionMeta.movingPath!.toArray()  

        this.store.dispatch(shiftScenarioTurn())
        this.store.dispatch(addUsedPlayer({ playerID: this.actionMeta.player.id })) 
        
        const tacklingSuccessful = this.isTacklingChallangeSuccessful()

        this.store.dispatch(setSelectableActions({ actions: [] }))                                   
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
                    if (tacklingSuccessful) {
                        this.store.dispatch(moveBall(position))
                    }                   
                } else {
                    this.movePlayer(position);
                }                
            });
    }
}