import { Injectable, Type } from "@angular/core";
import { Store } from "@ngrx/store";
import { equals, Hex, OffsetCoordinates } from "honeycomb-grid";
import { Step } from "../../../actions/classes/step.class";
import { GridService } from "../../grid/grid.service";
import { GeometryService } from "../../geometry/geometry.service";
import { ChallengeService } from "../../challenge/challenge.service";
import { TraverserService } from "../../traverser/traverser.service";
import { IsMouseOver } from "../../../actions/rules/is-mouse-over.rule";
import { IsTheNextStep } from "../../../actions/rules/is-the-next-step.rule";
import { HEXA_WIDTH, STANDARD_PASS_HEX_DISTANCE, STANDARD_PASS_PIXEL_DISTANCE } from "../../../constants";
import { StandardPassActionMeta } from "../../../actions/metas/standard-pass.action-meta";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { PlayerWithPosition } from "../../../interfaces/player-with-position.interface";
import { PlayerService } from "../../player/player.service";
import { StandardPassBallStep } from "./standard-pass-ball.step";

@Injectable({
    providedIn: 'root',
})
export class SetStandardPassingPathStep extends Step {
    actionMeta!: StandardPassActionMeta

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

    calculation(): void {
        this.actionMeta = {...this.context.actionMeta as StandardPassActionMeta}

        if (this.isSelectedHexPassable()) {
            this.generatePassingPath()
            this.generateChallengeHexes()
        } else {
            this.resetPassingPath()
            this.resetChallengeHexes()
        }
        this.generateAvailableNextSteps()
    }

    isSelectedHexPassable() {
        const selectedPoint: OffsetCoordinates = this.context.hex;
        return this.actionMeta.availableTargets.getHex(selectedPoint) || false
    }

    generatePassingPath() {  
        const startCoordinate: OffsetCoordinates = this.actionMeta.playerHex;       
        const startHex = this.grid.getHex(startCoordinate)
        const endHex = this.grid.getHex(this.context.hex)

        if (startHex && endHex) {        
            this.actionMeta.passingPath = [startHex, endHex]   
        }             
    }

    generateCoveredHexesByPassPath(): Hex[] {    
        const startHex: Hex = this.actionMeta.passingPath![0]
        const endHex: Hex = this.actionMeta.passingPath![1]
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
        this.actionMeta.challengeHexes = this.challenge.generateChallengeHexes(coveredHexes)
    }

    resetPassingPath() {
        this.actionMeta.passingPath = []
    }

    resetChallengeHexes() {
        this.actionMeta.challengeHexes = new Map();
    }

    generateAvailableNextSteps() {        
        this.actionMeta.availableNextSteps = [
            StandardPassBallStep,
            SetStandardPassingPathStep         
        ];
    }

    updateState(): void { 
        this.store.dispatch(saveActionMeta(this.actionMeta));        
    }
}
