import { Injectable, Type } from "@angular/core";
import { Store } from "@ngrx/store";
import { equals, Hex, OffsetCoordinates } from "honeycomb-grid";

import { Step } from "../../../../actions/classes/step.class";
import { InitPassingStepMeta } from "../../../../actions/metas/passing/init-passing.step-meta";
import { GridService } from "../../../grid/grid.service";
import { GeometryService } from "../../../geometry/geometry.service";
import { ChallengeService } from "../../../challenge/challenge.service";
import { TraverserService } from "../../../traverser/traverser.service";
import { IsMouseOver } from "../../../../actions/rules/is-mouse-over.rule";
import { IsTheNextStep } from "../../../../actions/rules/is-the-next-step.rule";
import { GameContext } from "../../../../actions/classes/game-context.interface";
import { HEXA_WIDTH, STANDARD_PASS_HEX_DISTANCE, STANDARD_PASS_PIXEL_DISTANCE } from "../../../../constants";
import { InitHighPassingStep } from "../../high-pass/init-high-passing/init-high-passing.step.service";
import { CancelStep } from "../../cancel/cancel.service";
import { SetStandardPassingPathStepMeta } from "../../../../actions/metas/passing/standard-passing/set-standard-passing-path.step-meta";
import { saveStepMeta } from "../../../../stores/action/action.actions";
import { PlayerWithPosition } from "../../../../interfaces/player-with-position.interface";
import { PlayerService } from "../../../player/player.service";
import { StandardPassBallStep } from "../standard-pass-ball/standard-pass-ball.step.service";

@Injectable({
    providedIn: 'root',
})
export class SetStandardPassingPathStep extends Step {
    passingPath!: Hex[]
    challengeHexes!: Map<string,Hex>
    lastStepMeta!: InitPassingStepMeta
    availableNextSteps: Type<Step>[] = []

    attackingTeamPlayersWithPositions!: PlayerWithPosition[]

    constructor(
        private store: Store,
        private player: PlayerService,
        private grid: GridService,
        private geometry: GeometryService,
        private traverser: TraverserService,
        private challenge: ChallengeService
    ) {
        super()
        this.initRuleSet()
        this.initSubscriptions()
    }

    initRuleSet(): void {
        this.addRule(new IsMouseOver());  
        this.addRule(new IsTheNextStep(SetStandardPassingPathStep)); 
    }

    initSubscriptions() {
        const attackingPlayersWithPositionsSubscriptions = this.player.getAttackingPlayersWithPositions().subscribe(attackingTeamPlayersWithPositions => {
            this.attackingTeamPlayersWithPositions = attackingTeamPlayersWithPositions
        })
        this.addSubscription(attackingPlayersWithPositionsSubscriptions)
    }

    calculation(context: GameContext): void {
        this.lastStepMeta = context.lastStepMeta as InitPassingStepMeta;

        if (this.isSelectedHexPassable(context)) {
            this.generatePassingPath(context)
            this.generateChallengeHexes()
        } else {
            this.resetPassingPath()
            this.resetChallengeHexes()
        }
        this.generateAvailableNextSteps()
    }

    isSelectedHexPassable(context: GameContext) {
        const selectedPoint: OffsetCoordinates = context.hex;
        return this.lastStepMeta.availableTargets.getHex(selectedPoint) || false
    }

    generatePassingPath(context: GameContext) {  
        const startCoordinate: OffsetCoordinates = this.lastStepMeta.playerHex;       
        const startHex = this.grid.getHex(startCoordinate)
        const endHex = this.grid.getHex(context.hex)

        if (startHex && endHex) {        
            this.passingPath = [startHex, endHex]   
        }             
    }

    generateCoveredHexesByPassPath(): Hex[] {
        const startHex: Hex = this.passingPath[0]
        const endHex: Hex = this.passingPath[1]
        const rectangleWidth = HEXA_WIDTH/2*1.000001
        const passLaneRectangle = this.geometry.offsetLineToRectangle(startHex, endHex, rectangleWidth)
        const baseAreaByDistance = this.traverser.getAreaByDistance(
            startHex, 
            STANDARD_PASS_HEX_DISTANCE,
            STANDARD_PASS_PIXEL_DISTANCE
        )

        return baseAreaByDistance
            .filter(availableTarget => {
                return this.geometry.isPointInRectangle(availableTarget, passLaneRectangle)
            })
            .filter(availableTarget => {
                return !this.attackingTeamPlayersWithPositions.some(teamMateWithPosition => equals(teamMateWithPosition.position, availableTarget))
            })
            .toArray()       
    }

    generateChallengeHexes() {
        this.resetChallengeHexes();
        const coveredHexes = this.generateCoveredHexesByPassPath();        
        this.challengeHexes = this.challenge.generateChallengeHexes(coveredHexes)
    }

    resetPassingPath() {
        this.passingPath = []
    }

    resetChallengeHexes() {
        this.challengeHexes = new Map();
    }

    generateAvailableNextSteps() {        
        this.availableNextSteps = [
            StandardPassBallStep,
            SetStandardPassingPathStep, 
            InitHighPassingStep, 
            CancelStep
        ];
    }

    updateState(context: GameContext): void {
        const setPassingPathStepMeta: SetStandardPassingPathStepMeta = {... this.lastStepMeta,             
            availableNextSteps: this.availableNextSteps,
            clickedHex: context.hex, 
            passingPath: this.passingPath,            
            targetHex: context.hex,
            challengeHexes: this.challengeHexes
        }          
        this.store.dispatch(saveStepMeta(setPassingPathStepMeta));        
    }
}
