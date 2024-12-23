import { Injectable, Type } from "@angular/core";
import { Step } from "../../../actions/classes/step.class";
import { Store } from "@ngrx/store";
import { AreAvailableNextStepsEmpty } from "../../../actions/rules/is-available-next-actions-empty.rule";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { GridService } from "../../grid/grid.service";
import { equals, Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { take } from "rxjs";
import { getPlayerPositions } from "../../../stores/player-position/player-position.selector";
import { MovingActionMeta } from "../../../actions/metas/moving.action-meta";
import { TraverserService } from "../../traverser/traverser.service";
import { FindMovingPathStep } from "./find-moving-path.step";
import { PlayerService } from "../../player/player.service";
import { getBallPosition } from "../../../stores/ball-position/ball-position.selector";
import { PlayerWithPosition } from "../../../interfaces/player-with-position.interface";

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
      private traverser: TraverserService,
      private player: PlayerService
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
      this.store.select(getPlayerPositions).pipe(take(1))
        .subscribe((occupiedCoordinates) => {
          const offsetCoordinates: OffsetCoordinates[] = Object.values(occupiedCoordinates)        
          const occupiedHexes = this.grid.createGrid().setHexes(offsetCoordinates).setHexes(this.grid.getFrame());
          let reachableHexes = this.traverser.getReachableHexes(centralPoint, distance, occupiedHexes)
          reachableHexes = this.extendReachableHexesWithTacklableBaller(occupiedHexes, reachableHexes, centralPoint, distance)
          this.reachableHexes = reachableHexes.filter(hex => hex !== centralPoint);  
        })
    }

    extendReachableHexesWithTacklableBaller(occupiedHexes: Grid<Hex>, reachableHexes: Grid<Hex>, centralPoint: Hex, distance: number) {
      if (!this.ballerAttackerHex) return reachableHexes
      
      const occupiedHexesWithoutBaller = occupiedHexes.filter(hex => !equals(hex, this.ballerAttackerHex))
      const reachableHexesWithBaller = this.traverser.getReachableHexes(centralPoint, distance, occupiedHexesWithoutBaller)
      if (reachableHexesWithBaller.hasHex(this.ballerAttackerHex)) {
        reachableHexes.setHexes([this.ballerAttackerHex])
      }

      return reachableHexes
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