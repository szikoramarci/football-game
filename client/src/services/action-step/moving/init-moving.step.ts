import { Injectable, Type } from "@angular/core";
import { Step } from "../../../actions/classes/step.class";
import { Store } from "@ngrx/store";
import { AreAvailableNextStepsEmpty } from "../../../actions/rules/is-available-next-actions-empty.rule";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { GridService } from "../../grid/grid.service";
import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { MovingActionMeta } from "../../../actions/metas/moving.action-meta";
import { FindMovingPathStep } from "./find-moving-path.step";
import { getBallPosition } from "../../../stores/ball-position/ball-position.selector";
import { MovingHelperService } from "../../action-helper/moving-helper.service";

@Injectable({
  providedIn: 'root',
})
export class InitMovingStep extends Step {
    reachableHexes!: Grid<Hex>;
    availableNextSteps: Type<Step>[] = [];
    ballPosition!: OffsetCoordinates
  
    constructor(
      private store: Store,
      private grid: GridService,
      private movingHelper: MovingHelperService
    ) {
      super()     
      this.initSubscriptions()
    }

    initRuleSet() {      
      this.addRule(new AreAvailableNextStepsEmpty());
    }

    initSubscriptions() {     
      const ballPositionSubscriptions = this.store.select(getBallPosition()).subscribe(ballPosition => {                        
          this.ballPosition = ballPosition as OffsetCoordinates
      })    
      this.addSubscription(ballPositionSubscriptions)
    }
  
    calculation(): void {      
      this.generateReachableHexes();            
      this.generateAvailableNextSteps();      
    }

    generateReachableHexes() {
      const centralPoint = this.context.hex;
      const distance = this.context.player?.speed || 0;  
      this.reachableHexes = this.movingHelper.generateReachableHexes(centralPoint, distance, null)
      this.reachableHexes = this.reachableHexes.filter(hex => hex !== centralPoint)     
    }        

    generateAvailableNextSteps() {
      this.availableNextSteps = [FindMovingPathStep];
    }
  
    updateState(): void {
      const movingActionMeta: MovingActionMeta = {
        clickedHex: this.context.hex,
        playerHex: this.context.hex,        
        player: this.context.player!,
        playerHasBall: this.context.playerHasBall,
        reachableHexes: this.reachableHexes,
        pathPoints: [],
        possibleMovingPath: this.grid.createGrid(),
        finalMovingPath: this.grid.createGrid(),
        availableNextSteps: this.availableNextSteps
      }      
      this.store.dispatch(saveActionMeta(movingActionMeta));      
    }
  }