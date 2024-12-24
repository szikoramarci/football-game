import { Injectable, Type } from "@angular/core";
import { Step } from "../../../actions/classes/step.class";
import { Store } from "@ngrx/store";
import { AreAvailableNextStepsEmpty } from "../../../actions/rules/is-available-next-actions-empty.rule";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { GridService } from "../../grid/grid.service";
import { equals, Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { MovingActionMeta } from "../../../actions/metas/moving.action-meta";
import { FindMovingPathStep } from "./find-moving-path.step";
import { PlayerService } from "../../player/player.service";
import { getBallPosition } from "../../../stores/ball-position/ball-position.selector";
import { PlayerWithPosition } from "../../../interfaces/player-with-position.interface";
import { MovingHelperService } from "../../action-helper/moving-helper.service";

@Injectable({
  providedIn: 'root',
})
export class InitMovingStep extends Step {
    reachableHexes!: Grid<Hex>;
    availableNextSteps: Type<Step>[] = [];
    ballPosition!: OffsetCoordinates
    attackingTeamPlayersWithPositions: PlayerWithPosition[] = []
    ballerAttackerHex!: Hex
  
    constructor(
      private store: Store,
      private grid: GridService,
      private player: PlayerService,
      private movingHelper: MovingHelperService
    ) {
      super()     
      this.initSubscriptions()
    }

    initRuleSet() {      
      this.addRule(new AreAvailableNextStepsEmpty());
    }

    initSubscriptions() {
      const attackingTeamPlayersWithPositionsSubscriptions = this.player.getAttackingPlayersWithPositions().subscribe(attackingTeamPlayersWithPositions => {
          this.attackingTeamPlayersWithPositions = attackingTeamPlayersWithPositions        
      })  
      const ballPositionSubscriptions = this.store.select(getBallPosition()).subscribe(ballPosition => {                        
          this.ballPosition = ballPosition as OffsetCoordinates
      })    
      this.addSubscription(attackingTeamPlayersWithPositionsSubscriptions)
      this.addSubscription(ballPositionSubscriptions)
    }
  
    calculation(): void {      
      this.determineAttackerBallerHex();
      this.generateReachableHexes();            
      this.generateAvailableNextSteps();      
    }

    generateReachableHexes() {
      const centralPoint = this.context.hex;
      const distance = this.context.player?.speed || 0;  
      this.reachableHexes = this.movingHelper.generateReachableHexes(centralPoint, distance, this.ballerAttackerHex, null)
      this.reachableHexes = this.reachableHexes.filter(hex => hex !== centralPoint)     
    }    

    determineAttackerBallerHex() {
      const playerWithBall = this.attackingTeamPlayersWithPositions.find(playerWithPosition => equals(playerWithPosition.position, this.ballPosition))      
      const currentPlayerIsInDefendingTeam = !!playerWithBall && playerWithBall?.player.team !== this.context.player?.team
      if (currentPlayerIsInDefendingTeam) {
        this.ballerAttackerHex = this.grid.getHex(playerWithBall!.position)!
      }
    }

    generateAvailableNextSteps() {
      this.availableNextSteps = [FindMovingPathStep];
    }
  
    updateState(): void {
      const movingActionMeta: MovingActionMeta = {
        clickedHex: this.context.hex,
        playerHex: this.context.hex,        
        player: this.context.player!,
        playerHasBall: this.context.playerHasBall,
        reachableHexes: this.reachableHexes,
        pathPoints: [],
        possibleMovingPath: this.grid.createGrid(),
        finalMovingPath: this.grid.createGrid(),
        ballerAttackerHex: this.ballerAttackerHex,
        availableNextSteps: this.availableNextSteps
      }      
      this.store.dispatch(saveActionMeta(movingActionMeta));      
    }
  }