import { Injectable, Type } from "@angular/core";
import { Step } from "../../../actions/classes/step.class";
import { IsOwnPlayer } from "../../../actions/rules/move/is-own-player.rule";
import { IsPlayerSelected } from "../../../actions/rules/move/is-player-selected.rule";
import { Grid, Hex, OffsetCoordinates, reachable, spiral } from "honeycomb-grid";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";
import { IsTheNextStep } from "../../../actions/rules/is-the-next-step.rule";
import { IsPickedPlayerClicked } from "../../../actions/rules/cancel/is-picked-player-clicked.rule";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { HasThePlayerTheBall } from "../../../actions/rules/pass/has-the-player-the-ball.rule";
import { TraverserService } from "../../traverser/traverser.service";
import { HIGH_PASS_HEX_DISTANCE, HIGH_PASS_PIXEL_DISTANCE } from "../../../constants";
import { GridService } from "../../grid/grid.service";
import { SectorService } from "../../sector/sector.service";
import { PlayerWithPosition } from "../../../interfaces/player-with-position.interface";
import { PlayerService } from "../../player/player.service";
import { Store } from "@ngrx/store";
import { HighPassActionMeta } from "../../../actions/metas/high-pass.action-meta";

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

    calculation(): void {  
      this.generateBaseAreaOfDistance()
      this.removeSurrundingHexesFromBaseArea()
      this.removeUnsightTargets()
      this.getTeamMatesInBaseArea()
    }  
    
    removeUnsightTargets() {
      const startHex: Hex | undefined  = this.context.hex

      const neighborHexes = this.availableTargets.traverse(spiral({ start: this.context.hex, radius: 1 }))
      const neighborOppositionPositions = this.getFilteredPlayerPositions(this.defensiveTeamPlayersWithPositions, neighborHexes)        
      const oppositonPlayerPositions = this.grid.createGrid().setHexes(neighborOppositionPositions)

      this.availableTargets = this.sector.removeUnsightTargets(startHex!, this.availableTargets, oppositonPlayerPositions)    
    }

    generateBaseAreaOfDistance() {
      this.availableTargets = this.traverser.getAreaByDistance(
        this.context.hex!, 
        HIGH_PASS_HEX_DISTANCE,
        HIGH_PASS_PIXEL_DISTANCE
      )
    }

    removeSurrundingHexesFromBaseArea(){
        const surroundingHexes = this.availableTargets.traverse(spiral({ start: this.context.hex, radius: 3 }))
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
  
    updateState(): void {
      const initPassingStepMeta: HighPassActionMeta = {     
        clickedHex: this.context.hex,
        playerHex: this.context.hex,
        availableNextSteps: this.availableNextSteps,
        availableTargets: this.availableTargets,
        possibleHeadingPlayers: this.possibleHeadingPlayers
      }
      this.store.dispatch(saveActionMeta(initPassingStepMeta));
    }
  }