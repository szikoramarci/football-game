import { Injectable, Type } from "@angular/core";
import { Step } from "../../../actions/classes/step.class";
import { Store } from "@ngrx/store";
import { AreAvailableNextStepsEmpty } from "../../../actions/rules/is-available-next-actions-empty.rule";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { GridService } from "../../grid/grid.service";
import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { take } from "rxjs";
import { getPlayerPositions } from "../../../stores/player-position/player-position.selector";
import { MovingActionMeta } from "../../../actions/metas/moving.action-meta";
import { TraverserService } from "../../traverser/traverser.service";
import { SetMovingPathStep } from "./set-moving-path.step";

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
      this.addRule(new AreAvailableNextStepsEmpty());
    }
  
    calculation(): void {      
      this.generateReachableHexes();      
      this.generateAvailableNextSteps();      
    }

    generateReachableHexes() {
      const centralPoint = this.context.hex;
      const distance = this.context.player?.speed || 0;      
      this.store.select(getPlayerPositions).pipe(take(1))
        .subscribe((occupiedCoordinates) => {
          const offsetCoordinates: OffsetCoordinates[] = Object.values(occupiedCoordinates)        
          const occupiedHexes = this.grid.createGrid().setHexes(offsetCoordinates).setHexes(this.grid.getFrame());
          this.reachableHexes = this.traverser.getReachableHexes(centralPoint, distance, occupiedHexes)
        })
    }

    generateAvailableNextSteps() {
      this.availableNextSteps = [SetMovingPathStep];
    }
  
    updateState(): void {
      const movingActionMeta: MovingActionMeta = {
        clickedHex: this.context.hex,
        playerHex: this.context.hex,        
        playerID: this.context.player?.id,
        playerHasBall: this.context.playerHasBall,
        reachableHexes: this.reachableHexes,
        availableNextSteps: this.availableNextSteps
      }      
      this.store.dispatch(saveActionMeta(movingActionMeta));      
    }
  }