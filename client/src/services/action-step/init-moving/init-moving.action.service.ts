import { Injectable, Type } from "@angular/core";
import { ActionStepContext } from "../../../action-steps/interfaces/action-step-context.interface";
import { ActionStepStrategy } from "../../../action-steps/interfaces/action-step-strategy.interface";
import { ActionStepRuleSet } from "../../../action-steps/interfaces/action-step-rule.interface";
import { IsOwnPlayer } from "../../../action-steps/rules/move/is-own-player.rule";
import { Store } from "@ngrx/store";
import { IsAvailableNextActionsEmpty } from "../../../action-steps/rules/is-available-next-actions-empty.rule";
import { IsPlayerSelected } from "../../../action-steps/rules/move/is-player-selected.rule";
import { saveActionStepMeta } from "../../../stores/action/action.actions";
import { GridService } from "../../grid/grid.service";
import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { IsLeftClick } from "../../../action-steps/rules/is-left-click.rule";
import { take } from "rxjs";
import { playerMovementEvents } from "../../../stores/player-position/player-position.selector";
import { InitStandardPassingActionStep } from "../init-standard-passing/init-standard-passing.action.service";
import { SetMovingPathActionStep } from "../set-moving-path/set-moving-path.action.service";
import { InitMovingActionStepMeta } from "../../../action-steps/metas/moving/init-moving.action-step-meta";
import { CancelActionStep } from "../cancel/cancel.service";
import { TraverserService } from "../../traverser/traverser.service";

@Injectable({
  providedIn: 'root',
})
export class InitMovingActionStep implements ActionStepStrategy {
    ruleSet: ActionStepRuleSet;
    reachableHexes!: Grid<Hex>;
    availableNextActionSteps: Type<ActionStepStrategy>[] = [];
  
    constructor(
      private store: Store,
      private grid: GridService,
      private traverser: TraverserService
    ) {
      this.ruleSet = new ActionStepRuleSet();
      this.ruleSet.addRule(new IsLeftClick());
      this.ruleSet.addRule(new IsAvailableNextActionsEmpty());
      this.ruleSet.addRule(new IsPlayerSelected());
      this.ruleSet.addRule(new IsOwnPlayer());
    }
  
    identify(context: ActionStepContext): boolean {
      return this.ruleSet.validate(context);
    }
  
    calculation(context: ActionStepContext): void {      
      this.generateReachableHexes(context);      
      this.generateAvailableNextActionSteps(context);      
    }

    generateReachableHexes(context: ActionStepContext) {
      const centralPoint = context.coordinates;
      const distance = context.player?.speed || 0;      
      this.store.select(playerMovementEvents).pipe(take(1))
        .subscribe((occupiedCoordinates) => {
          const offsetCoordinates: OffsetCoordinates[] = Object.values(occupiedCoordinates)        
          const occupiedHexes = this.grid.createGrid().setHexes(offsetCoordinates).setHexes(this.grid.getFrame());
          this.reachableHexes = this.traverser.getReachableHexes(centralPoint, distance, occupiedHexes)
        })
    }

    generateAvailableNextActionSteps(context: ActionStepContext) {
      this.availableNextActionSteps = [SetMovingPathActionStep, CancelActionStep];
     
      if (context.playerHasBall){
        this.availableNextActionSteps.push(InitStandardPassingActionStep);        
      }
    }
  
    updateState(context: ActionStepContext): void {
      const initMovingActionMeta: InitMovingActionStepMeta = {
        actionType: InitMovingActionStep,
        timestamp: new Date(),
        clickedCoordinates: context.coordinates,
        playerCoordinates: context.coordinates,        
        playerID: context.player?.id,
        playerHasBall: context.playerHasBall,
        reachableHexes: this.reachableHexes,
        availableNextActionSteps: this.availableNextActionSteps
      }
      this.store.dispatch(saveActionStepMeta(initMovingActionMeta));      
    }
  }