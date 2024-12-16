import { Injectable, Type } from "@angular/core";
import { GameContext } from "../../../../actions/classes/game-context.interface";
import { Step } from "../../../../actions/classes/step.class";
import { IsOwnPlayer } from "../../../../actions/rules/move/is-own-player.rule";
import { Store } from "@ngrx/store";
import { AreAvailableNextStepsEmpty } from "../../../../actions/rules/is-available-next-actions-empty.rule";
import { IsPlayerSelected } from "../../../../actions/rules/move/is-player-selected.rule";
import { saveStepMeta } from "../../../../stores/action/action.actions";
import { GridService } from "../../../grid/grid.service";
import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { IsLeftClick } from "../../../../actions/rules/is-left-click.rule";
import { take } from "rxjs";
import { getPlayerPositions } from "../../../../stores/player-position/player-position.selector";
import { InitMovingStepMeta } from "../../../../actions/metas/moving/init-moving.step-meta";
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
    }

    initRuleSet() {      
      this.addRule(new IsLeftClick());
      this.addRule(new AreAvailableNextStepsEmpty());
      this.addRule(new IsPlayerSelected());
      this.addRule(new IsOwnPlayer());
    }
  
    calculation(context: GameContext): void {      
      this.generateReachableHexes(context);      
      this.generateAvailableNextSteps(context);      
    }

    generateReachableHexes(context: GameContext) {
      const centralPoint = context.hex;
      const distance = context.player?.speed || 0;      
      this.store.select(getPlayerPositions).pipe(take(1))
        .subscribe((occupiedCoordinates) => {
          const offsetCoordinates: OffsetCoordinates[] = Object.values(occupiedCoordinates)        
          const occupiedHexes = this.grid.createGrid().setHexes(offsetCoordinates).setHexes(this.grid.getFrame());
          this.reachableHexes = this.traverser.getReachableHexes(centralPoint, distance, occupiedHexes)
        })
    }

    generateAvailableNextSteps(context: GameContext) {
      this.availableNextSteps = [SetMovingPathStep, CancelStep];
     
      if (context.playerHasBall){
        this.availableNextSteps.push(InitStandardPassingStep);        
      }
    }
  
    updateState(context: GameContext): void {
      const initMovingStepMeta: InitMovingStepMeta = {
        clickedHex: context.hex,
        playerHex: context.hex,        
        playerID: context.player?.id,
        playerHasBall: context.playerHasBall,
        reachableHexes: this.reachableHexes,
        availableNextSteps: this.availableNextSteps
      }
      this.store.dispatch(saveStepMeta(initMovingStepMeta));      
    }
  }