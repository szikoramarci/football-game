import { Injectable, Type } from "@angular/core";
import { Store } from "@ngrx/store";
import { Grid, Hex } from "@szikoramarci/honeycomb-grid";
import { Step } from "../../../actions/classes/step.class";
import { GridService } from "../../grid/grid.service";
import { TraverserService } from "../../traverser/traverser.service";
import { SectorService } from "../../sector/sector.service";
import { STANDARD_PASS_HEX_DISTANCE, STANDARD_PASS_PIXEL_DISTANCE } from "../../../constants";
import { SetStandardPassingPathStep } from "./set-standard-passing-path.step";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { PlayerWithPosition } from "../../../interfaces/player-with-position.interface";
import { PlayerService } from "../../player/player.service";
import { AreAvailableNextStepsEmpty } from "../../../actions/rules/is-available-next-actions-empty.rule";
import { StandardPassActionMeta } from "../../../actions/metas/standard-pass.action-meta";

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

    calculation(): void {  
        this.generateBaseAreaOfDistance();
        this.removeUnsightTargets();
        this.generateAvailableNextSteps();
    }

    generateBaseAreaOfDistance() {      
      this.availableTargets = this.traverser.getAreaByDistance(
        this.context.hex, 
        STANDARD_PASS_HEX_DISTANCE,
        STANDARD_PASS_PIXEL_DISTANCE
      )
    }

    removeUnsightTargets() {
      const startHex: Hex | undefined = this.context.hex

      const oppositionPlayerPositionsInArea = this.defensiveTeamPlayersWithPositions
        .filter(playerWithPosition => this.availableTargets.getHex(playerWithPosition.position))
        .map(playerWithPosition => playerWithPosition.position)

      const oppositonPlayerPositions = this.grid.createGrid().setHexes(oppositionPlayerPositionsInArea);
      this.availableTargets = this.sector.removeUnsightTargets(startHex!, this.availableTargets, oppositonPlayerPositions);    
    }

    generateAvailableNextSteps() {
      this.availableNextSteps = [SetStandardPassingPathStep];     
    }
  
    updateState(): void {
      const standardPassActionMeta: StandardPassActionMeta = {     
        clickedHex: this.context.hex,
        playerHex: this.context.hex,
        availableNextSteps: this.availableNextSteps,
        availableTargets: this.availableTargets
      }
      this.store.dispatch(saveActionMeta(standardPassActionMeta));
    }
  }