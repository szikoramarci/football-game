import { Injectable, Type } from "@angular/core";
import { StepContext } from "../../../action-steps/interfaces/step-context.interface";
import { Step } from "../../../action-steps/interfaces/step.interface";
import { StepRuleSet } from "../../../action-steps/interfaces/step-rule.interface";
import { IsOwnPlayer } from "../../../action-steps/rules/move/is-own-player.rule";
import { Store } from "@ngrx/store";
import { IsPlayerSelected } from "../../../action-steps/rules/move/is-player-selected.rule";
import { GridService } from "../../grid/grid.service";
import { Grid, Hex } from "honeycomb-grid";
import { IsLeftClick } from "../../../action-steps/rules/is-left-click.rule";
import { IsTheNextStep } from "../../../action-steps/rules/is-the-next-step.rule";
import { IsPickedPlayerClicked } from "../../../action-steps/rules/cancel/is-picked-player-clicked.rule";
import { CancelStep } from "../cancel/cancel.service";
import { saveStepMeta } from "../../../stores/action/action.actions";
import { InitPassingStepMeta } from "../../../action-steps/metas/passing/init-passing.step-meta";
import { HasThePlayerTheBall } from "../../../action-steps/rules/pass/has-the-player-the-ball.rule";
import { map, take } from "rxjs";
import { STANDARD_PASS_HEX_DISTANCE, STANDARD_PASS_PIXEL_DISTANCE } from "../../../constants";
import { selectOppositeTeamPlayersWithPositions } from "../../../stores/gameplay/gameplay.selector";
import { SetStandardPassingPathStep } from "../set-standard-passing-path/set-standard-passing-path.step.service";
import { TraverserService } from "../../traverser/traverser.service";
import { InitHighPassingStep } from "../init-high-passing/init-high-passing.step.service";
import { SectorService } from "../../sector/sector.service";

@Injectable({
  providedIn: 'root',
})
export class InitStandardPassingStep implements Step {
    ruleSet: StepRuleSet;
    availableTargets!: Grid<Hex>;
    availableNextSteps: Type<Step>[] = [];
  
    constructor(
      private store: Store,
      private grid: GridService,
      private traverser: TraverserService,
      private sector: SectorService
    ) {
      this.ruleSet = new StepRuleSet();
      this.ruleSet.addRule(new IsLeftClick());
      this.ruleSet.addRule(new IsTheNextStep(InitStandardPassingStep));    
      this.ruleSet.addRule(new IsPickedPlayerClicked());
      this.ruleSet.addRule(new IsPlayerSelected());
      this.ruleSet.addRule(new HasThePlayerTheBall());
      this.ruleSet.addRule(new IsOwnPlayer());
    }
  
    identify(context: StepContext): boolean {
      return this.ruleSet.validate(context);
    }

    calculation(context: StepContext): void {  
        this.generateBaseAreaOfDistance(context);
        this.removeUnsightTargets(context);
        this.generateAvailableNextSteps(context);
    }

    generateBaseAreaOfDistance(context: StepContext) {
      this.availableTargets = this.traverser.getAreaByDistance(
        context.lastStepMeta?.clickedCoordinates!, 
        STANDARD_PASS_HEX_DISTANCE,
        STANDARD_PASS_PIXEL_DISTANCE
      )
    }

    removeUnsightTargets(context: StepContext) {
      const startHex: Hex | undefined = this.grid.getHex(context.lastStepMeta?.clickedCoordinates!)

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

    generateAvailableNextSteps(context: StepContext) {
      this.availableNextSteps = [SetStandardPassingPathStep, CancelStep];
     
      if (context.playerHasBall){
        this.availableNextSteps.push(InitHighPassingStep);        
      }
    }
  
    updateState(context: StepContext): void {
      const initPassingStepMeta: InitPassingStepMeta = {     
        stepType: InitStandardPassingStep,   
        timestamp: new Date(),
        clickedCoordinates: context.coordinates,
        playerCoordinates: context.coordinates,
        availableNextSteps: this.availableNextSteps,
        availableTargets: this.availableTargets
      }
      this.store.dispatch(saveStepMeta(initPassingStepMeta));
    }
  }