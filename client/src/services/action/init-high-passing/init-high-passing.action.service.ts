import { Injectable, Type } from "@angular/core";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { IsOwnPlayer } from "../../../actions/rules/move/is-own-player.rule";
import { MemoizedSelector, Store } from "@ngrx/store";
import { IsPlayerSelected } from "../../../actions/rules/move/is-player-selected.rule";
import { Grid, Hex, OffsetCoordinates, reachable, spiral } from "honeycomb-grid";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";
import { IsTheNextAction } from "../../../actions/rules/is-the-next-action.rule";
import { IsPickedPlayerClicked } from "../../../actions/rules/cancel/is-picked-player-clicked.rule";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { HasThePlayerTheBall } from "../../../actions/rules/pass/has-the-player-the-ball.rule";
import { TraverserService } from "../../traverser/traverser.service";
import { CancelAction } from "../cancel/cancel.service";
import { HIGH_PASS_HEX_DISTANCE, HIGH_PASS_PIXEL_DISTANCE } from "../../../constants";
import { selectActiveTeamPlayersWithPositions, selectOppositeTeamPlayersWithPositions } from "../../../stores/gameplay/gameplay.selector";
import { forkJoin, map, Observable, take } from "rxjs";
import { GridService } from "../../grid/grid.service";
import { SectorService } from "../../sector/sector.service";
import { SetHighPassingPathAction } from "../set-high-passing-path/set-high-passing-path.action.service";
import { PlayerWithPosition } from "../../../interfaces/player-with-position.interface";
import { InitHighPassingActionMeta } from "../../../actions/metas/init-high-passing.action.meta";

@Injectable({
  providedIn: 'root',
})
export class InitHighPassingAction implements ActionStrategy {
    ruleSet: ActionRuleSet;
    availableTargets!: Grid<Hex>;
    possibleHeadingPlayers!: Map<OffsetCoordinates, OffsetCoordinates[]>
    availableNextActions: Type<ActionStrategy>[] = [];
  
    constructor(
      private store: Store,
      private traverser: TraverserService,
      private grid: GridService,
      private sector: SectorService
    ) {
      this.ruleSet = new ActionRuleSet();
      this.ruleSet.addRule(new IsLeftClick());
      this.ruleSet.addRule(new IsTheNextAction(InitHighPassingAction));    
      this.ruleSet.addRule(new IsPickedPlayerClicked());
      this.ruleSet.addRule(new IsPlayerSelected());
      this.ruleSet.addRule(new HasThePlayerTheBall());
      this.ruleSet.addRule(new IsOwnPlayer());
    }
  
    identify(context: ActionContext): boolean {
      return this.ruleSet.validate(context);
    }

    calculation(context: ActionContext): void {  
      this.generateBaseAreaOfDistance(context)
      this.removeSurrundingHexesFromBaseArea(context)
      this.removeUnsightTargets(context)
      this.getTeamMatesInBaseArea()
      this.generateAvailableNextActions(context);  
    }  
    
    removeUnsightTargets(context: ActionContext) {
      const startHex: Hex | undefined  = this.grid.getHex(context.lastActionMeta?.clickedCoordinates!)

      const neighborHexes = this.availableTargets.traverse(spiral({ start: context.lastActionMeta?.clickedCoordinates, radius: 1 }))
      this.getFilteredPlayerPositions(selectOppositeTeamPlayersWithPositions, neighborHexes)
        .subscribe(neighborOppositionPositions => {    
          const oppositonPlayerPositions = this.grid.createGrid().setHexes(neighborOppositionPositions)
          this.availableTargets = this.sector.removeUnsightTargets(startHex!, this.availableTargets, oppositonPlayerPositions)
        })      
    }

    generateBaseAreaOfDistance(context: ActionContext) {
      this.availableTargets = this.traverser.getAreaByDistance(
        context.lastActionMeta?.clickedCoordinates!, 
        HIGH_PASS_HEX_DISTANCE,
        HIGH_PASS_PIXEL_DISTANCE
      )
    }

    removeSurrundingHexesFromBaseArea(context: ActionContext){
        const surroundingHexes = this.availableTargets.traverse(spiral({ start: context.lastActionMeta?.clickedCoordinates!, radius: 3 }))
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

    generateAvailableNextActions(context: ActionContext) {
      this.availableNextActions = [SetHighPassingPathAction, CancelAction];
    }
  
    updateState(context: ActionContext): void {
      const initPassingActionMeta: InitHighPassingActionMeta = {     
        actionType: InitHighPassingAction,   
        timestamp: new Date(),
        clickedCoordinates: context.coordinates,
        playerCoordinates: context.coordinates,
        availableNextActions: this.availableNextActions,
        availableTargets: this.availableTargets,
        possibleHeadingPlayers: this.possibleHeadingPlayers
      }
      this.store.dispatch(saveActionMeta(initPassingActionMeta));
    }
  }