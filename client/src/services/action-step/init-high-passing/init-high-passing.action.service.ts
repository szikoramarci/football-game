import { Injectable, Type } from "@angular/core";
import { ActionStepContext } from "../../../action-steps/interfaces/action-step-context.interface";
import { ActionStepStrategy } from "../../../action-steps/interfaces/action-step-strategy.interface";
import { ActionStepRuleSet } from "../../../action-steps/interfaces/action-step-rule.interface";
import { IsOwnPlayer } from "../../../action-steps/rules/move/is-own-player.rule";
import { MemoizedSelector, Store } from "@ngrx/store";
import { IsPlayerSelected } from "../../../action-steps/rules/move/is-player-selected.rule";
import { Grid, Hex, OffsetCoordinates, reachable, spiral } from "honeycomb-grid";
import { IsLeftClick } from "../../../action-steps/rules/is-left-click.rule";
import { IsTheNextActionStep } from "../../../action-steps/rules/is-the-next-action.rule";
import { IsPickedPlayerClicked } from "../../../action-steps/rules/cancel/is-picked-player-clicked.rule";
import { saveActionStepMeta } from "../../../stores/action/action.actions";
import { HasThePlayerTheBall } from "../../../action-steps/rules/pass/has-the-player-the-ball.rule";
import { TraverserService } from "../../traverser/traverser.service";
import { CancelActionStep } from "../cancel/cancel.service";
import { HIGH_PASS_HEX_DISTANCE, HIGH_PASS_PIXEL_DISTANCE } from "../../../constants";
import { selectActiveTeamPlayersWithPositions, selectOppositeTeamPlayersWithPositions } from "../../../stores/gameplay/gameplay.selector";
import { forkJoin, map, Observable, take } from "rxjs";
import { GridService } from "../../grid/grid.service";
import { SectorService } from "../../sector/sector.service";
import { SetHighPassingPathActionStep } from "../set-high-passing-path/set-high-passing-path.action.service";
import { PlayerWithPosition } from "../../../interfaces/player-with-position.interface";
import { InitHighPassingActionStepMeta } from "../../../action-steps/metas/passing/high-passing/init-high-passing.action-step-meta";

@Injectable({
  providedIn: 'root',
})
export class InitHighPassingActionStep implements ActionStepStrategy {
    ruleSet: ActionStepRuleSet;
    availableTargets!: Grid<Hex>;
    possibleHeadingPlayers!: Map<OffsetCoordinates, OffsetCoordinates[]>
    availableNextActionSteps: Type<ActionStepStrategy>[] = [];
  
    constructor(
      private store: Store,
      private traverser: TraverserService,
      private grid: GridService,
      private sector: SectorService
    ) {
      this.ruleSet = new ActionStepRuleSet();
      this.ruleSet.addRule(new IsLeftClick());
      this.ruleSet.addRule(new IsTheNextActionStep(InitHighPassingActionStep));    
      this.ruleSet.addRule(new IsPickedPlayerClicked());
      this.ruleSet.addRule(new IsPlayerSelected());
      this.ruleSet.addRule(new HasThePlayerTheBall());
      this.ruleSet.addRule(new IsOwnPlayer());
    }
  
    identify(context: ActionStepContext): boolean {
      return this.ruleSet.validate(context);
    }

    calculation(context: ActionStepContext): void {  
      this.generateBaseAreaOfDistance(context)
      this.removeSurrundingHexesFromBaseArea(context)
      this.removeUnsightTargets(context)
      this.getTeamMatesInBaseArea()
      this.generateAvailableNextActionSteps(context);  
    }  
    
    removeUnsightTargets(context: ActionStepContext) {
      const startHex: Hex | undefined  = this.grid.getHex(context.lastActionStepMeta?.clickedCoordinates!)

      const neighborHexes = this.availableTargets.traverse(spiral({ start: context.lastActionStepMeta?.clickedCoordinates, radius: 1 }))
      this.getFilteredPlayerPositions(selectOppositeTeamPlayersWithPositions, neighborHexes)
        .subscribe(neighborOppositionPositions => {    
          const oppositonPlayerPositions = this.grid.createGrid().setHexes(neighborOppositionPositions)
          this.availableTargets = this.sector.removeUnsightTargets(startHex!, this.availableTargets, oppositonPlayerPositions)
        })      
    }

    generateBaseAreaOfDistance(context: ActionStepContext) {
      this.availableTargets = this.traverser.getAreaByDistance(
        context.lastActionStepMeta?.clickedCoordinates!, 
        HIGH_PASS_HEX_DISTANCE,
        HIGH_PASS_PIXEL_DISTANCE
      )
    }

    removeSurrundingHexesFromBaseArea(context: ActionStepContext){
        const surroundingHexes = this.availableTargets.traverse(spiral({ start: context.lastActionStepMeta?.clickedCoordinates!, radius: 3 }))
        this.availableTargets = this.availableTargets.filter(availableTarget => !surroundingHexes.getHex(availableTarget))
    }

    getFilteredPlayerPositions(selector: MemoizedSelector<any, PlayerWithPosition[]>, availableHexes: Grid<Hex>): Observable<OffsetCoordinates[]> {
      return this.store.select(selector).pipe(
        take(1),
        map(playersWithPosition => playersWithPosition
          .filter(playerWithPosition => availableHexes.getHex(playerWithPosition.position))
          .map(playerWithPosition => playerWithPosition.position)
        )
      )
    }

    getTeamMatesInBaseArea() {     
      forkJoin([
        this.getFilteredPlayerPositions(selectActiveTeamPlayersWithPositions, this.availableTargets),
        this.getFilteredPlayerPositions(selectOppositeTeamPlayersWithPositions, this.availableTargets)
      ]).subscribe(([teamMatesInArea, oppositionsInArea]) => {          
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
      })              
    }

    generateAvailableNextActionSteps(context: ActionStepContext) {
      this.availableNextActionSteps = [SetHighPassingPathActionStep, CancelActionStep];
    }
  
    updateState(context: ActionStepContext): void {
      const initPassingActionMeta: InitHighPassingActionStepMeta = {     
        actionType: InitHighPassingActionStep,   
        timestamp: new Date(),
        clickedCoordinates: context.coordinates,
        playerCoordinates: context.coordinates,
        availableNextActionSteps: this.availableNextActionSteps,
        availableTargets: this.availableTargets,
        possibleHeadingPlayers: this.possibleHeadingPlayers
      }
      this.store.dispatch(saveActionStepMeta(initPassingActionMeta));
    }
  }