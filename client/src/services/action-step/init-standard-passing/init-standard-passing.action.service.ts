import { Injectable, Type } from "@angular/core";
import { ActionStepContext } from "../../../action-steps/interfaces/action-step-context.interface";
import { ActionStepStrategy } from "../../../action-steps/interfaces/action-step-strategy.interface";
import { ActionStepRuleSet } from "../../../action-steps/interfaces/action-step-rule.interface";
import { IsOwnPlayer } from "../../../action-steps/rules/move/is-own-player.rule";
import { Store } from "@ngrx/store";
import { IsPlayerSelected } from "../../../action-steps/rules/move/is-player-selected.rule";
import { GridService } from "../../grid/grid.service";
import { Grid, Hex } from "honeycomb-grid";
import { IsLeftClick } from "../../../action-steps/rules/is-left-click.rule";
import { IsTheNextActionStep } from "../../../action-steps/rules/is-the-next-action.rule";
import { IsPickedPlayerClicked } from "../../../action-steps/rules/cancel/is-picked-player-clicked.rule";
import { CancelActionStep } from "../cancel/cancel.service";
import { saveActionStepMeta } from "../../../stores/action/action.actions";
import { InitPassingActionStepMeta } from "../../../action-steps/metas/passing/init-passing.action-step-meta";
import { HasThePlayerTheBall } from "../../../action-steps/rules/pass/has-the-player-the-ball.rule";
import { map, take } from "rxjs";
import { STANDARD_PASS_HEX_DISTANCE, STANDARD_PASS_PIXEL_DISTANCE } from "../../../constants";
import { selectOppositeTeamPlayersWithPositions } from "../../../stores/gameplay/gameplay.selector";
import { SetStandardPassingPathActionStep } from "../set-standard-passing-path/set-standard-passing-path.action.service";
import { TraverserService } from "../../traverser/traverser.service";
import { InitHighPassingActionStep } from "../init-high-passing/init-high-passing.action.service";
import { SectorService } from "../../sector/sector.service";

@Injectable({
  providedIn: 'root',
})
export class InitStandardPassingActionStep implements ActionStepStrategy {
    ruleSet: ActionStepRuleSet;
    availableTargets!: Grid<Hex>;
    availableNextActionSteps: Type<ActionStepStrategy>[] = [];
  
    constructor(
      private store: Store,
      private grid: GridService,
      private traverser: TraverserService,
      private sector: SectorService
    ) {
      this.ruleSet = new ActionStepRuleSet();
      this.ruleSet.addRule(new IsLeftClick());
      this.ruleSet.addRule(new IsTheNextActionStep(InitStandardPassingActionStep));    
      this.ruleSet.addRule(new IsPickedPlayerClicked());
      this.ruleSet.addRule(new IsPlayerSelected());
      this.ruleSet.addRule(new HasThePlayerTheBall());
      this.ruleSet.addRule(new IsOwnPlayer());
    }
  
    identify(context: ActionStepContext): boolean {
      return this.ruleSet.validate(context);
    }

    calculation(context: ActionStepContext): void {  
        this.generateBaseAreaOfDistance(context);
        this.removeUnsightTargets(context);
        this.generateAvailableNextActionSteps(context);
    }

    generateBaseAreaOfDistance(context: ActionStepContext) {
      this.availableTargets = this.traverser.getAreaByDistance(
        context.lastActionStepMeta?.clickedCoordinates!, 
        STANDARD_PASS_HEX_DISTANCE,
        STANDARD_PASS_PIXEL_DISTANCE
      )
    }

    removeUnsightTargets(context: ActionStepContext) {
      const startHex: Hex | undefined = this.grid.getHex(context.lastActionStepMeta?.clickedCoordinates!)

      this.store.select(selectOppositeTeamPlayersWithPositions).pipe(
        take(1),
        map(playersWithPosition => playersWithPosition
          .filter(playerWithPosition => this.availableTargets.getHex(playerWithPosition.position))
          .map(playerWithPosition => playerWithPosition.position)
        )
      ).subscribe(oppositionPlayerPositionsInArea => {
        const oppositonPlayerPositions = this.grid.createGrid().setHexes(oppositionPlayerPositionsInArea);
        this.availableTargets = this.sector.removeUnsightTargets(startHex!, this.availableTargets, oppositonPlayerPositions);
      });
    
    }

    generateAvailableNextActionSteps(context: ActionStepContext) {
      this.availableNextActionSteps = [SetStandardPassingPathActionStep, CancelActionStep];
     
      if (context.playerHasBall){
        this.availableNextActionSteps.push(InitHighPassingActionStep);        
      }
    }
  
    updateState(context: ActionStepContext): void {
      const initPassingActionMeta: InitPassingActionStepMeta = {     
        actionType: InitStandardPassingActionStep,   
        timestamp: new Date(),
        clickedCoordinates: context.coordinates,
        playerCoordinates: context.coordinates,
        availableNextActionSteps: this.availableNextActionSteps,
        availableTargets: this.availableTargets
      }
      this.store.dispatch(saveActionStepMeta(initPassingActionMeta));
    }
  }