import { Injectable, Type } from "@angular/core";
import { StepContext } from "../../../action-steps/interfaces/step-context.interface";
import { Step } from "../../../action-steps/interfaces/step.interface";
import { StepRuleSet } from "../../../action-steps/interfaces/step-rule.interface";
import { IsOwnPlayer } from "../../../action-steps/rules/move/is-own-player.rule";
import { Store } from "@ngrx/store";
import { AreAvailableNextStepsEmpty } from "../../../action-steps/rules/is-available-next-actions-empty.rule";
import { IsPlayerSelected } from "../../../action-steps/rules/move/is-player-selected.rule";
import { saveStepMeta } from "../../../stores/action/action.actions";
import { GridService } from "../../grid/grid.service";
import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { IsLeftClick } from "../../../action-steps/rules/is-left-click.rule";
import { take } from "rxjs";
import { playerMovementEvents } from "../../../stores/player-position/player-position.selector";
import { InitStandardPassingStep } from "../init-standard-passing/init-standard-passing.step.service";
import { SetMovingPathStep } from "../set-moving-path/set-moving-path.step.service";
import { InitMovingStepMeta } from "../../../action-steps/metas/moving/init-moving.step-meta";
import { CancelStep } from "../cancel/cancel.service";
import { TraverserService } from "../../traverser/traverser.service";

@Injectable({
  providedIn: 'root',
})
export class InitMovingStep implements Step {
    ruleSet: StepRuleSet;
    reachableHexes!: Grid<Hex>;
    availableNextSteps: Type<Step>[] = [];
  
    constructor(
      private store: Store,
      private grid: GridService,
      private traverser: TraverserService
    ) {
      this.ruleSet = new StepRuleSet();
      this.ruleSet.addRule(new IsLeftClick());
      this.ruleSet.addRule(new AreAvailableNextStepsEmpty());
      this.ruleSet.addRule(new IsPlayerSelected());
      this.ruleSet.addRule(new IsOwnPlayer());
    }
  
    identify(context: StepContext): boolean {
      return this.ruleSet.validate(context);
    }
  
    calculation(context: StepContext): void {      
      this.generateReachableHexes(context);      
      this.generateAvailableNextSteps(context);      
    }

    generateReachableHexes(context: StepContext) {
      const centralPoint = context.coordinates;
      const distance = context.player?.speed || 0;      
      this.store.select(playerMovementEvents).pipe(take(1))
        .subscribe((occupiedCoordinates) => {
          const offsetCoordinates: OffsetCoordinates[] = Object.values(occupiedCoordinates)        
          const occupiedHexes = this.grid.createGrid().setHexes(offsetCoordinates).setHexes(this.grid.getFrame());
          this.reachableHexes = this.traverser.getReachableHexes(centralPoint, distance, occupiedHexes)
        })
    }

    generateAvailableNextSteps(context: StepContext) {
      this.availableNextSteps = [SetMovingPathStep, CancelStep];
     
      if (context.playerHasBall){
        this.availableNextSteps.push(InitStandardPassingStep);        
      }
    }
  
    updateState(context: StepContext): void {
      const initMovingStepMeta: InitMovingStepMeta = {
        stepType: InitMovingStep,
        timestamp: new Date(),
        clickedCoordinates: context.coordinates,
        playerCoordinates: context.coordinates,        
        playerID: context.player?.id,
        playerHasBall: context.playerHasBall,
        reachableHexes: this.reachableHexes,
        availableNextSteps: this.availableNextSteps
      }
      this.store.dispatch(saveStepMeta(initMovingStepMeta));      
    }
  }