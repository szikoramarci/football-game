import { Injectable, Type } from "@angular/core";
import { Store } from "@ngrx/store";
import { Grid, Hex } from "honeycomb-grid";
import { Step } from "../../../../actions/classes/step.class";
import { GridService } from "../../../grid/grid.service";
import { TraverserService } from "../../../traverser/traverser.service";
import { SectorService } from "../../../sector/sector.service";
import { IsLeftClick } from "../../../../actions/rules/is-left-click.rule";
import { IsPickedPlayerClicked } from "../../../../actions/rules/cancel/is-picked-player-clicked.rule";
import { IsPlayerSelected } from "../../../../actions/rules/move/is-player-selected.rule";
import { HasThePlayerTheBall } from "../../../../actions/rules/pass/has-the-player-the-ball.rule";
import { IsOwnPlayer } from "../../../../actions/rules/move/is-own-player.rule";
import { GameContext } from "../../../../actions/classes/game-context.interface";
import { STANDARD_PASS_HEX_DISTANCE, STANDARD_PASS_PIXEL_DISTANCE } from "../../../../constants";
import { SetStandardPassingPathStep } from "../set-standard-passing-path/set-standard-passing-path.step.service";
import { CancelStep } from "../../cancel/cancel.service";
import { InitHighPassingStep } from "../../high-pass/init-high-passing/init-high-passing.step.service";
import { saveStepMeta } from "../../../../stores/action/action.actions";
import { InitPassingStepMeta } from "../../../../actions/metas/passing/init-passing.step-meta";
import { PlayerWithPosition } from "../../../../interfaces/player-with-position.interface";
import { PlayerService } from "../../../player/player.service";
import { AreAvailableNextStepsEmpty } from "../../../../actions/rules/is-available-next-actions-empty.rule";

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
      this.addRule(new AreAvailableNextStepsEmpty());  
    }

    initSubscriptions() {
      const defensiveTeamPlayersWithPositionsSubscriptions = this.player.getDefendingPlayersWithPositions().subscribe(defensiveTeamPlayersWithPositions => {
        this.defensiveTeamPlayersWithPositions = defensiveTeamPlayersWithPositions        
      })      
      this.addSubscription(defensiveTeamPlayersWithPositionsSubscriptions)
    }

    calculation(context: GameContext): void {  
        this.generateBaseAreaOfDistance(context);
        this.removeUnsightTargets(context);
        this.generateAvailableNextSteps(context);
    }

    generateBaseAreaOfDistance(context: GameContext) {      
      this.availableTargets = this.traverser.getAreaByDistance(
        context.hex, 
        STANDARD_PASS_HEX_DISTANCE,
        STANDARD_PASS_PIXEL_DISTANCE
      )
    }

    removeUnsightTargets(context: GameContext) {
      const startHex: Hex | undefined = context.hex

      const oppositionPlayerPositionsInArea = this.defensiveTeamPlayersWithPositions
        .filter(playerWithPosition => this.availableTargets.getHex(playerWithPosition.position))
        .map(playerWithPosition => playerWithPosition.position)

      const oppositonPlayerPositions = this.grid.createGrid().setHexes(oppositionPlayerPositionsInArea);
      this.availableTargets = this.sector.removeUnsightTargets(startHex!, this.availableTargets, oppositonPlayerPositions);    
    }

    generateAvailableNextSteps(context: GameContext) {
      this.availableNextSteps = [SetStandardPassingPathStep, CancelStep];
     
      if (context.playerHasBall){
        this.availableNextSteps.push(InitHighPassingStep);        
      }
    }
  
    updateState(context: GameContext): void {
      const initPassingStepMeta: InitPassingStepMeta = {     
        clickedHex: context.hex,
        playerHex: context.hex,
        availableNextSteps: this.availableNextSteps,
        availableTargets: this.availableTargets
      }
      this.store.dispatch(saveStepMeta(initPassingStepMeta));
    }
  }