import { Injectable, Type } from "@angular/core";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { IsOwnPlayer } from "../../../actions/rules/move/is-own-player.rule";
import { Store } from "@ngrx/store";
import { IsPlayerSelected } from "../../../actions/rules/move/is-player-selected.rule";
import { GridService } from "../../grid/grid.service";
import { Grid, Hex } from "honeycomb-grid";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";
import { IsTheNextAction } from "../../../actions/rules/is-the-next-action.rule";
import { IsPickedPlayerClicked } from "../../../actions/rules/cancel/is-picked-player-clicked.rule";
import { CancelAction } from "../cancel/cancel.service";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { InitPassingActionMeta } from "../../../actions/metas/init-passing.action.meta";
import { HasThePlayerTheBall } from "../../../actions/rules/pass/has-the-player-the-ball.rule";
import { map, take } from "rxjs";
import { STANDARD_PASS_HEX_DISTANCE, STANDARD_PASS_PIXEL_DISTANCE } from "../../../constants";
import { selectOppositeTeamPlayersWithPositions } from "../../../stores/gameplay/gameplay.selector";
import { SetPassingPathAction } from "../set-passing-path/set-passing-path.action.service";
import { TraverserService } from "../../traverser/traverser.service";
import { Sector } from "../../../interfaces/sector.interface";
import { GeometryService } from "../../geometry/geometry.service";
import { InitHighPassingAction } from "../init-high-passing/init-high-passing.action.service";

@Injectable({
  providedIn: 'root',
})
export class InitStandardPassingAction implements ActionStrategy {
    ruleSet: ActionRuleSet;
    availableTargets!: Grid<Hex>;
    oppositonPlayerPositions!: Grid<Hex>;
    availableNextActions: Type<ActionStrategy>[] = [];
  
    constructor(
      private store: Store,
      private grid: GridService,
      private traverser: TraverserService,
      private geometry: GeometryService
    ) {
      this.ruleSet = new ActionRuleSet();
      this.ruleSet.addRule(new IsLeftClick());
      this.ruleSet.addRule(new IsTheNextAction(InitStandardPassingAction));    
      this.ruleSet.addRule(new IsPickedPlayerClicked());
      this.ruleSet.addRule(new IsPlayerSelected());
      this.ruleSet.addRule(new HasThePlayerTheBall());
      this.ruleSet.addRule(new IsOwnPlayer());
    }
  
    identify(context: ActionContext): boolean {
      return this.ruleSet.validate(context);
    }

    calculation(context: ActionContext): void {  
        this.generateBaseAreaOfDistance(context);
        this.getOppositionPlayersInBaseArea();
        this.removeUnsightTargets(context);
        this.generateAvailableNextActions(context);
    }

    generateBaseAreaOfDistance(context: ActionContext) {
      this.availableTargets = this.traverser.getAreaByDistance(
        context.lastActionMeta?.clickedCoordinates!, 
        STANDARD_PASS_HEX_DISTANCE,
        STANDARD_PASS_PIXEL_DISTANCE
      )
    }

    getOppositionPlayersInBaseArea() {      
      this.store.select(selectOppositeTeamPlayersWithPositions).pipe(
        take(1),
        map(playersWithPosition => playersWithPosition
          .filter(playerWithPosition => this.availableTargets.getHex(playerWithPosition.position))
          .map(playerWithPosition => playerWithPosition.position)
        )
      ).subscribe(oppositionPlayerPositionsInArea => {
        this.oppositonPlayerPositions = this.grid.createGrid().setHexes(oppositionPlayerPositionsInArea);
      });
    }

    removeUnsightTargets(context: ActionContext) {
      const startHex = this.grid.getHex(context.lastActionMeta?.clickedCoordinates!)
      if (!startHex) return;

      const sectors: Sector[] = this.generateSectorsFromOpponents(startHex)

      this.availableTargets = this.filterVisibleTargets(startHex, sectors);
    }

    generateSectorsFromOpponents(startingHex: Hex): Sector[] {
      const sectors: Sector[] = [];

      this.oppositonPlayerPositions.forEach(opponentPosition => {
        const edgePoints = this.geometry.findEdgePointsFromPointPerspective(
          startingHex,
          opponentPosition.corners
        );

        sectors.push({
          startAngle: this.geometry.calculateAngle(startingHex, edgePoints[0]),
          endAngle: this.geometry.calculateAngle(startingHex, edgePoints[1]),
          distance: this.geometry.calculatePointDistance(startingHex, opponentPosition)
        });
      });

      return sectors;
    }
    
    filterVisibleTargets(startingHex: Hex, sectors: Sector[]): Grid<Hex> {
      return this.availableTargets.filter(targetHex => {
        return !sectors.some(sector => this.geometry.isPointInSector(startingHex, targetHex, sector));
      });
    }

    generateAvailableNextActions(context: ActionContext) {
      this.availableNextActions = [SetPassingPathAction, CancelAction];
     
      if (context.playerHasBall){
        this.availableNextActions.push(InitHighPassingAction);        
      }
    }
  
    updateState(context: ActionContext): void {
      const initPassingActionMeta: InitPassingActionMeta = {     
        actionType: InitStandardPassingAction,   
        timestamp: new Date(),
        clickedCoordinates: context.coordinates,
        playerCoordinates: context.coordinates,
        availableNextActions: this.availableNextActions,
        availableTargets: this.availableTargets
      }
      this.store.dispatch(saveActionMeta(initPassingActionMeta));
    }
  }