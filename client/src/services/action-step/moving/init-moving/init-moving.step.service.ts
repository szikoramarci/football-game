import { Injectable, Type } from "@angular/core";
import { StepContext } from "../../../../action-steps/classes/step-context.interface";
import { Step } from "../../../../action-steps/classes/step.class";
import { IsOwnPlayer } from "../../../../action-steps/rules/move/is-own-player.rule";
import { Store } from "@ngrx/store";
import { AreAvailableNextStepsEmpty } from "../../../../action-steps/rules/is-available-next-actions-empty.rule";
import { IsPlayerSelected } from "../../../../action-steps/rules/move/is-player-selected.rule";
import { saveStepMeta } from "../../../../stores/action/action.actions";
import { GridService } from "../../../grid/grid.service";
import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { IsLeftClick } from "../../../../action-steps/rules/is-left-click.rule";
import { take } from "rxjs";
import { getPlayerPositions } from "../../../../stores/player-position/player-position.selector";
import { InitMovingStepMeta } from "../../../../action-steps/metas/moving/init-moving.step-meta";
import { CancelStep } from "../../cancel/cancel.service";
import { TraverserService } from "../../../traverser/traverser.service";
import { SetMovingPathStep } from "../set-moving-path/set-moving-path.step.service";
import { InitStandardPassingStep } from "../../standard-pass/init-standard-passing/init-standard-passing.step.service";

@Injectable({
  providedIn: 'root',
})
export class InitMovingStep extends Step {
    reachableHexes!: Grid<Hex>;
    availableNextSteps: Type<Step>[] = [];
  
    constructor(
      private store: Store,
      private grid: GridService,
      private traverser: TraverserService
    ) {
      super()
      this.initRuleSet()
    }

    initRuleSet() {      
      this.addRule(new IsLeftClick());
      this.addRule(new AreAvailableNextStepsEmpty());
      this.addRule(new IsPlayerSelected());
      this.addRule(new IsOwnPlayer());
    }
  
    calculation(context: StepContext): void {      
      this.generateReachableHexes(context);      
      this.generateAvailableNextSteps(context);      
    }

    generateReachableHexes(context: StepContext) {
      const centralPoint = context.coordinates;
      const distance = context.player?.speed || 0;      
      this.store.select(getPlayerPositions).pipe(take(1))
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