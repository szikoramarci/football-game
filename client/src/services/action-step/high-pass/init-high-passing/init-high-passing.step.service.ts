import { Injectable, Type } from "@angular/core";
import { StepContext } from "../../../../action-steps/classes/step-context.interface";
import { Step } from "../../../../action-steps/classes/step.class";
import { IsOwnPlayer } from "../../../../action-steps/rules/move/is-own-player.rule";
import { IsPlayerSelected } from "../../../../action-steps/rules/move/is-player-selected.rule";
import { Grid, Hex, OffsetCoordinates, reachable, spiral } from "honeycomb-grid";
import { IsLeftClick } from "../../../../action-steps/rules/is-left-click.rule";
import { IsTheNextStep } from "../../../../action-steps/rules/is-the-next-step.rule";
import { IsPickedPlayerClicked } from "../../../../action-steps/rules/cancel/is-picked-player-clicked.rule";
import { saveStepMeta } from "../../../../stores/action/action.actions";
import { HasThePlayerTheBall } from "../../../../action-steps/rules/pass/has-the-player-the-ball.rule";
import { TraverserService } from "../../../traverser/traverser.service";
import { CancelStep } from "../../cancel/cancel.service";
import { HIGH_PASS_HEX_DISTANCE, HIGH_PASS_PIXEL_DISTANCE } from "../../../../constants";
import { GridService } from "../../../grid/grid.service";
import { SectorService } from "../../../sector/sector.service";
import { SetHighPassingPathStep } from "../set-high-passing-path/set-high-passing-path.step.service";
import { PlayerWithPosition } from "../../../../interfaces/player-with-position.interface";
import { InitHighPassingStepMeta } from "../../../../action-steps/metas/passing/high-passing/init-high-passing.step-meta";
import { PlayerService } from "../../../player/player.service";
import { Store } from "@ngrx/store";

@Injectable({
  providedIn: 'root',
})
export class InitHighPassingStep extends Step {
    availableTargets!: Grid<Hex>;
    possibleHeadingPlayers!: Map<OffsetCoordinates, OffsetCoordinates[]>
    availableNextSteps: Type<Step>[] = [];

    attackingTeamPlayersWithPositions: PlayerWithPosition[] = []
    defensiveTeamPlayersWithPositions: PlayerWithPosition[] = []
  
    constructor(
      private store: Store,
      private traverser: TraverserService,
      private grid: GridService,
      private sector: SectorService,
      private player: PlayerService
    ) {
      super()
      this.initRuleSet()
      this.initSubscriptions()
    }
  
    initRuleSet(): void {
      this.addRule(new IsLeftClick());
      this.addRule(new IsTheNextStep(InitHighPassingStep));    
      this.addRule(new IsPickedPlayerClicked());
      this.addRule(new IsPlayerSelected());
      this.addRule(new HasThePlayerTheBall());
      this.addRule(new IsOwnPlayer());
    }

    initSubscriptions() {
      const attackingPlayersWithPositionsSubscriptions = this.player.getAttackingPlayersWithPositions().subscribe(attackingTeamPlayersWithPositions => {
        this.attackingTeamPlayersWithPositions = attackingTeamPlayersWithPositions
      })
      const defensiveTeamPlayersWithPositionsSubscriptions = this.player.getDefendingPlayersWithPositions().subscribe(defensiveTeamPlayersWithPositions => {
        this.defensiveTeamPlayersWithPositions = defensiveTeamPlayersWithPositions
      })
      this.addSubscription(attackingPlayersWithPositionsSubscriptions)
      this.addSubscription(defensiveTeamPlayersWithPositionsSubscriptions)
    }

    calculation(context: StepContext): void {  
      this.generateBaseAreaOfDistance(context)
      this.removeSurrundingHexesFromBaseArea(context)
      this.removeUnsightTargets(context)
      this.getTeamMatesInBaseArea()
      this.generateAvailableNextSteps(context);  
    }  
    
    removeUnsightTargets(context: StepContext) {
      const startHex: Hex | undefined  = context.hex

      const neighborHexes = this.availableTargets.traverse(spiral({ start: context.lastStepMeta?.clickedCoordinates, radius: 1 }))
      const neighborOppositionPositions = this.getFilteredPlayerPositions(this.defensiveTeamPlayersWithPositions, neighborHexes)        
      const oppositonPlayerPositions = this.grid.createGrid().setHexes(neighborOppositionPositions)

      this.availableTargets = this.sector.removeUnsightTargets(startHex!, this.availableTargets, oppositonPlayerPositions)    
    }

    generateBaseAreaOfDistance(context: StepContext) {
      this.availableTargets = this.traverser.getAreaByDistance(
        context.lastStepMeta?.clickedCoordinates!, 
        HIGH_PASS_HEX_DISTANCE,
        HIGH_PASS_PIXEL_DISTANCE
      )
    }

    removeSurrundingHexesFromBaseArea(context: StepContext){
        const surroundingHexes = this.availableTargets.traverse(spiral({ start: context.lastStepMeta?.clickedCoordinates!, radius: 3 }))
        this.availableTargets = this.availableTargets.filter(availableTarget => !surroundingHexes.getHex(availableTarget))
    }

    getFilteredPlayerPositions(playerWithPositions: PlayerWithPosition[], availableHexes: Grid<Hex>): OffsetCoordinates[] {
      return playerWithPositions
          .filter(playerWithPosition => availableHexes.getHex(playerWithPosition.position))
          .map(playerWithPosition => playerWithPosition.position)              
    }

    getTeamMatesInBaseArea() {  
      const teamMatesInArea = this.getFilteredPlayerPositions(this.attackingTeamPlayersWithPositions, this.availableTargets)
      const oppositionsInArea = this.getFilteredPlayerPositions(this.defensiveTeamPlayersWithPositions, this.availableTargets)   
      
      const playersInAreaGrid = this.grid.createGrid().setHexes(oppositionsInArea).setHexes(teamMatesInArea)
      const filteredTargetHexes: Hex[] = []       
      this.possibleHeadingPlayers = new Map()

      teamMatesInArea.forEach(teamMatePosition => {   
        const availableTargetsForPlayer: OffsetCoordinates[] = []
        const teamMateSuroundingHexes = this.availableTargets.traverse(reachable(teamMatePosition, 3, playersInAreaGrid))        
        this.availableTargets.filter(availableTarget => teamMateSuroundingHexes.hasHex(availableTarget)).forEach(availableTarget => {           
          filteredTargetHexes.push(availableTarget)
          availableTargetsForPlayer.push(availableTarget)
        })       
        this.possibleHeadingPlayers.set(teamMatePosition, availableTargetsForPlayer)
      })

      this.availableTargets = this.grid.createGrid().setHexes(filteredTargetHexes)            
    }

    generateAvailableNextSteps(context: StepContext) {
      this.availableNextSteps = [SetHighPassingPathStep, CancelStep];
    }
  
    updateState(context: StepContext): void {
      const initPassingStepMeta: InitHighPassingStepMeta = {     
        clickedCoordinates: context.coordinates,
        playerCoordinates: context.coordinates,
        availableNextSteps: this.availableNextSteps,
        availableTargets: this.availableTargets,
        possibleHeadingPlayers: this.possibleHeadingPlayers
      }
      this.store.dispatch(saveStepMeta(initPassingStepMeta));
    }
  }