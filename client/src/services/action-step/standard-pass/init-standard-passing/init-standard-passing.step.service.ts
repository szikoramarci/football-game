import { Injectable, Type } from "@angular/core";
import { Store } from "@ngrx/store";
import { Grid, Hex } from "honeycomb-grid";
import { Step } from "../../../../action-steps/classes/step.class";
import { GridService } from "../../../grid/grid.service";
import { TraverserService } from "../../../traverser/traverser.service";
import { SectorService } from "../../../sector/sector.service";
import { IsLeftClick } from "../../../../action-steps/rules/is-left-click.rule";
import { IsTheNextStep } from "../../../../action-steps/rules/is-the-next-step.rule";
import { IsPickedPlayerClicked } from "../../../../action-steps/rules/cancel/is-picked-player-clicked.rule";
import { IsPlayerSelected } from "../../../../action-steps/rules/move/is-player-selected.rule";
import { HasThePlayerTheBall } from "../../../../action-steps/rules/pass/has-the-player-the-ball.rule";
import { IsOwnPlayer } from "../../../../action-steps/rules/move/is-own-player.rule";
import { ActionContext } from "../../../../action-steps/classes/action-context.interface";
import { STANDARD_PASS_HEX_DISTANCE, STANDARD_PASS_PIXEL_DISTANCE } from "../../../../constants";
import { SetStandardPassingPathStep } from "../set-standard-passing-path/set-standard-passing-path.step.service";
import { CancelStep } from "../../cancel/cancel.service";
import { InitHighPassingStep } from "../../high-pass/init-high-passing/init-high-passing.step.service";
import { saveStepMeta } from "../../../../stores/action/action.actions";
import { InitPassingStepMeta } from "../../../../action-steps/metas/passing/init-passing.step-meta";
import { PlayerWithPosition } from "../../../../interfaces/player-with-position.interface";
import { PlayerService } from "../../../player/player.service";
import { AreAvailableNextStepsEmpty } from "../../../../action-steps/rules/is-available-next-actions-empty.rule";

@Injectable({
  providedIn: 'root',
})
export class InitStandardPassingStep extends Step {
    availableTargets!: Grid<Hex>;
    availableNextSteps: Type<Step>[] = [];

    defensiveTeamPlayersWithPositions: PlayerWithPosition[] = []
  
    constructor(
      private store: Store,
      private grid: GridService,
      private traverser: TraverserService,
      private sector: SectorService,
      private player: PlayerService
    ) {
      super()
      this.initRuleSet()
      this.initSubscriptions()
    }
  
    initRuleSet(): void {
      this.addRule(new IsLeftClick());
      this.addRule(new AreAvailableNextStepsEmpty());  
      this.addRule(new IsPickedPlayerClicked());
      this.addRule(new IsPlayerSelected());
      this.addRule(new HasThePlayerTheBall());
      this.addRule(new IsOwnPlayer());
    }

    initSubscriptions() {
      const defensiveTeamPlayersWithPositionsSubscriptions = this.player.getDefendingPlayersWithPositions().subscribe(defensiveTeamPlayersWithPositions => {
        this.defensiveTeamPlayersWithPositions = defensiveTeamPlayersWithPositions        
      })      
      this.addSubscription(defensiveTeamPlayersWithPositionsSubscriptions)
    }

    calculation(context: ActionContext): void {  
        this.generateBaseAreaOfDistance(context);
        this.removeUnsightTargets(context);
        this.generateAvailableNextSteps(context);
    }

    generateBaseAreaOfDistance(context: ActionContext) {
      this.availableTargets = this.traverser.getAreaByDistance(
        context.lastStepMeta?.clickedCoordinates!, 
        STANDARD_PASS_HEX_DISTANCE,
        STANDARD_PASS_PIXEL_DISTANCE
      )
    }

    removeUnsightTargets(context: ActionContext) {
      const startHex: Hex | undefined = context.hex

      const oppositionPlayerPositionsInArea = this.defensiveTeamPlayersWithPositions
        .filter(playerWithPosition => this.availableTargets.getHex(playerWithPosition.position))
        .map(playerWithPosition => playerWithPosition.position)

      const oppositonPlayerPositions = this.grid.createGrid().setHexes(oppositionPlayerPositionsInArea);
      this.availableTargets = this.sector.removeUnsightTargets(startHex!, this.availableTargets, oppositonPlayerPositions);    
    }

    generateAvailableNextSteps(context: ActionContext) {
      this.availableNextSteps = [SetStandardPassingPathStep, CancelStep];
     
      if (context.playerHasBall){
        this.availableNextSteps.push(InitHighPassingStep);        
      }
    }
  
    updateState(context: ActionContext): void {
      const initPassingStepMeta: InitPassingStepMeta = {     
        clickedCoordinates: context.coordinates,
        playerCoordinates: context.coordinates,
        availableNextSteps: this.availableNextSteps,
        availableTargets: this.availableTargets
      }
      this.store.dispatch(saveStepMeta(initPassingStepMeta));
    }
  }