import { Injectable, Type } from "@angular/core";
import { StepRuleSet } from "../../../action-steps/interfaces/step-rule.interface";
import { Step } from "../../../action-steps/interfaces/step.interface";
import { Store } from "@ngrx/store";
import { StepContext } from "../../../action-steps/interfaces/step-context.interface";
import { IsTheNextStep } from "../../../action-steps/rules/is-the-next-step.rule";
import { GridService } from "../../grid/grid.service";
import { equals, Hex, OffsetCoordinates } from "honeycomb-grid";
import { saveStepMeta } from "../../../stores/action/action.actions";
import { CancelStep } from "../cancel/cancel.service";
import { IsMouseOver } from "../../../action-steps/rules/is-mouse-over.rule";
import { InitPassingStepMeta } from "../../../action-steps/metas/passing/init-passing.step-meta";
import { SetStandardPassingPathStepMeta } from "../../../action-steps/metas/passing/standard-passing/set-standard-passing-path.step-meta";
import { GeometryService } from "../../geometry/geometry.service";
import { HEXA_WIDTH, STANDARD_PASS_HEX_DISTANCE, STANDARD_PASS_PIXEL_DISTANCE } from "../../../constants";
import { TraverserService } from "../../traverser/traverser.service";
import { ChallengeService } from "../../challenge/challenge.service";
import { filter, from, Observable, toArray, switchMap, take } from "rxjs";
import { InitHighPassingStep } from "../init-high-passing/init-high-passing.step.service";
import { selectAttackingTeamPlayersWithPositions } from "../../../stores/gameplay/gameplay.selector";

@Injectable({
    providedIn: 'root',
})
export class SetStandardPassingPathStep implements Step {
    ruleSet: StepRuleSet
    passingPath!: Hex[]
    challengeHexes!: Map<string,Hex>
    lastStepMeta!: InitPassingStepMeta
    availableNextSteps: Type<Step>[] = []

    constructor(
        private store: Store,
        private grid: GridService,
        private geometry: GeometryService,
        private traverser: TraverserService,
        private challenge: ChallengeService
    ) {
        this.ruleSet = new StepRuleSet();   
        this.ruleSet.addRule(new IsMouseOver());  
        this.ruleSet.addRule(new IsTheNextStep(SetStandardPassingPathStep));                   
    }

    identify(context: StepContext): boolean {
        return this.ruleSet.validate(context);
    }

    calculation(context: StepContext): void {
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

    isSelectedHexPassable(context: StepContext) {
        const selectedPoint: OffsetCoordinates = context.coordinates;
        return this.lastStepMeta.availableTargets.getHex(selectedPoint) || false
    }

    generatePassingPath(context: StepContext) {  
        const startCoordinate: OffsetCoordinates = this.lastStepMeta.playerCoordinates;       
        const startHex = this.grid.getHex(startCoordinate)
        const endHex = this.grid.getHex(context.coordinates)

        if (startHex && endHex) {        
            this.passingPath = [startHex, endHex]   
        }             
    }

    generateCoveredHexesByPassPath(): Observable<Hex[]> {
        const startHex: Hex = this.passingPath[0]
        const endHex: Hex = this.passingPath[1]
        const rectangleWidth = HEXA_WIDTH/2*1.000001
        const passLaneRectangle = this.geometry.offsetLineToRectangle(startHex, endHex, rectangleWidth)
        const baseAreaByDistance = this.traverser.getAreaByDistance(
            startHex, 
            STANDARD_PASS_HEX_DISTANCE,
            STANDARD_PASS_PIXEL_DISTANCE
        )

        return this.store.select(selectAttackingTeamPlayersWithPositions).pipe(
            take(1),
            switchMap(teamMatesWithPosition => 
                from(baseAreaByDistance)
                .pipe(
                    filter(availableTarget => {
                        return this.geometry.isPointInRectangle(availableTarget, passLaneRectangle)
                    }),
                    filter(availableTarget => {
                        return !teamMatesWithPosition.some(teamMateWithPosition => equals(teamMateWithPosition.position, availableTarget))
                    }),
                    toArray()
                )               
            )
        )
    }

    generateChallengeHexes() {
        this.resetChallengeHexes();

        this.generateCoveredHexesByPassPath().subscribe(coveredHexes => {
            this.challenge.generateChallengeHexes(coveredHexes).subscribe(challengeHexes => {
                this.challengeHexes = challengeHexes
            })
        })               
    }

    resetPassingPath() {
        this.passingPath = []
    }

    resetChallengeHexes() {
        this.challengeHexes = new Map();
    }

    generateAvailableNextSteps() {        
        this.availableNextSteps = [SetStandardPassingPathStep, InitHighPassingStep, CancelStep];
    }

    updateState(context: StepContext): void {
        const setPassingPathStepMeta: SetStandardPassingPathStepMeta = {... this.lastStepMeta,             
            timestamp: new Date(),
            availableNextSteps: this.availableNextSteps,
            clickedCoordinates: context.coordinates, 
            passingPath: this.passingPath,            
            targetHex: context.coordinates,
            challengeHexes: this.challengeHexes
        }          
        this.store.dispatch(saveStepMeta(setPassingPathStepMeta));        
    }
}
