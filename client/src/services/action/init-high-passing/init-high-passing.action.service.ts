import { Injectable, Type } from "@angular/core";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { IsOwnPlayer } from "../../../actions/rules/move/is-own-player.rule";
import { Store } from "@ngrx/store";
import { IsPlayerSelected } from "../../../actions/rules/move/is-player-selected.rule";
import { Grid, Hex, neighborOf, spiral } from "honeycomb-grid";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";
import { IsTheNextAction } from "../../../actions/rules/is-the-next-action.rule";
import { IsPickedPlayerClicked } from "../../../actions/rules/cancel/is-picked-player-clicked.rule";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { InitPassingActionMeta } from "../../../actions/metas/init-passing.action.meta";
import { HasThePlayerTheBall } from "../../../actions/rules/pass/has-the-player-the-ball.rule";
import { TraverserService } from "../../traverser/traverser.service";
import { CancelAction } from "../cancel/cancel.service";
import { HIGH_PASS_HEX_DISTANCE, HIGH_PASS_PIXEL_DISTANCE } from "../../../constants";
import { selectActiveTeamPlayersWithPositions, selectOppositeTeamPlayersWithPositions } from "../../../stores/gameplay/gameplay.selector";
import { map, take } from "rxjs";
import { GridService } from "../../grid/grid.service";
import { SectorService } from "../../sector/sector.service";
import { SetPassingPathAction } from "../set-passing-path/set-passing-path.action.service";

@Injectable({
  providedIn: 'root',
})
export class InitHighPassingAction implements ActionStrategy {
    ruleSet: ActionRuleSet;
    availableTargets!: Grid<Hex>;
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
      this.removeUnsightTargets(context)
      this.removeSurrundingHexesFromBaseArea(context)
      this.getTeamMatesInBaseArea()

      this.generateAvailableNextActions(context);  
    }   

    removeUnsightTargets(context: ActionContext) {
      const startHex: Hex | undefined  = this.grid.getHex(context.lastActionMeta?.clickedCoordinates!)

      const neighborHexes = this.availableTargets.traverse(spiral({ start: context.lastActionMeta?.clickedCoordinates, radius: 1 }))
      this.store.select(selectOppositeTeamPlayersWithPositions).pipe(
        take(1),
        map(playersWithPosition => playersWithPosition
          .filter(playerWithPosition => neighborHexes.getHex(playerWithPosition.position))
          .map(playerWithPosition => playerWithPosition.position)
        )).subscribe(neighborOppositionsHexes => {    
          const oppositonPlayerPositions = this.grid.createGrid().setHexes(neighborOppositionsHexes)
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

    getTeamMatesInBaseArea() {      
      this.store.select(selectActiveTeamPlayersWithPositions).pipe(
        take(1),
        map(playersWithPosition => playersWithPosition
          .filter(playerWithPosition => this.availableTargets.getHex(playerWithPosition.position))
          .map(playerWithPosition => playerWithPosition.position)
        )
      ).subscribe(teamMatesInArea => {
        const filteredTargetHexes: Hex[] = []       
        teamMatesInArea.forEach(teamMatePosition => {          
        const teamMateSuroundingHexes = this.availableTargets.traverse(spiral({ start: teamMatePosition, radius: 3 }))
          this.availableTargets.filter(availableTarget => teamMateSuroundingHexes.hasHex(availableTarget)).forEach(availableTarget => {           
            filteredTargetHexes.push(availableTarget)
          })       
        })
        this.availableTargets = this.grid.createGrid().setHexes(filteredTargetHexes)
      });
    }


    generateAvailableNextActions(context: ActionContext) {
      this.availableNextActions = [SetPassingPathAction, CancelAction];
    }
  
    updateState(context: ActionContext): void {
      const initPassingActionMeta: InitPassingActionMeta = {     
        actionType: InitHighPassingAction,   
        timestamp: new Date(),
        clickedCoordinates: context.coordinates,
        playerCoordinates: context.coordinates,
        availableNextActions: this.availableNextActions,
        availableTargets: this.availableTargets
      }
      this.store.dispatch(saveActionMeta(initPassingActionMeta));
    }
  }