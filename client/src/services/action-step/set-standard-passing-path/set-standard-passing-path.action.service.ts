import { Injectable, Type } from "@angular/core";
import { ActionStepRuleSet } from "../../../action-steps/interfaces/action-step-rule.interface";
import { ActionStepStrategy } from "../../../action-steps/interfaces/action-step-strategy.interface";
import { Store } from "@ngrx/store";
import { ActionStepContext } from "../../../action-steps/interfaces/action-step-context.interface";
import { IsTheNextActionStep } from "../../../action-steps/rules/is-the-next-action.rule";
import { GridService } from "../../grid/grid.service";
import { equals, Hex, OffsetCoordinates } from "honeycomb-grid";
import { saveActionStepMeta } from "../../../stores/action/action.actions";
import { CancelActionStep } from "../cancel/cancel.service";
import { IsMouseOver } from "../../../action-steps/rules/is-mouse-over.rule";
import { InitPassingActionStepMeta } from "../../../action-steps/metas/passing/init-passing.action-step-meta";
import { SetStandardPassingPathActionStepMeta } from "../../../action-steps/metas/passing/standard-passing/set-standard-passing-path.action-step-meta";
import { GeometryService } from "../../geometry/geometry.service";
import { HEXA_WIDTH, STANDARD_PASS_HEX_DISTANCE, STANDARD_PASS_PIXEL_DISTANCE } from "../../../constants";
import { TraverserService } from "../../traverser/traverser.service";
import { ChallengeService } from "../../challenge/challenge.service";
import { selectActiveTeamPlayersWithPositions } from "../../../stores/gameplay/gameplay.selector";
import { filter, from, Observable, toArray, switchMap, take } from "rxjs";
import { InitHighPassingActionStep } from "../init-high-passing/init-high-passing.action.service";

@Injectable({
    providedIn: 'root',
})
export class SetStandardPassingPathActionStep implements ActionStepStrategy {
    ruleSet: ActionStepRuleSet
    passingPath!: Hex[]
    challengeHexes!: Map<string,Hex>
    lastActionStepMeta!: InitPassingActionStepMeta
    availableNextActionSteps: Type<ActionStepStrategy>[] = []

    constructor(
        private store: Store,
        private grid: GridService,
        private geometry: GeometryService,
        private traverser: TraverserService,
        private challenge: ChallengeService
    ) {
        this.ruleSet = new ActionStepRuleSet();   
        this.ruleSet.addRule(new IsMouseOver());  
        this.ruleSet.addRule(new IsTheNextActionStep(SetStandardPassingPathActionStep));                   
    }

    identify(context: ActionStepContext): boolean {
        return this.ruleSet.validate(context);
    }

    calculation(context: ActionStepContext): void {
        this.lastActionStepMeta = context.lastActionStepMeta as InitPassingActionStepMeta;

        if (this.isSelectedHexPassable(context)) {
            this.generatePassingPath(context)
            this.generateChallengeHexes()
        } else {
            this.resetPassingPath()
            this.resetChallengeHexes()
        }
        this.generateAvailableNextActionSteps()
    }

    isSelectedHexPassable(context: ActionStepContext) {
        const selectedPoint: OffsetCoordinates = context.coordinates;
        return this.lastActionStepMeta.availableTargets.getHex(selectedPoint) || false
    }

    generatePassingPath(context: ActionStepContext) {  
        const startCoordinate: OffsetCoordinates = this.lastActionStepMeta.playerCoordinates;       
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

        return this.store.select(selectActiveTeamPlayersWithPositions).pipe(
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

    generateAvailableNextActionSteps() {        
        this.availableNextActionSteps = [SetStandardPassingPathActionStep, InitHighPassingActionStep, CancelActionStep];
    }

    updateState(context: ActionStepContext): void {
        const setPassingPathActionMeta: SetStandardPassingPathActionStepMeta = {... this.lastActionStepMeta,             
            timestamp: new Date(),
            availableNextActionSteps: this.availableNextActionSteps,
            clickedCoordinates: context.coordinates, 
            passingPath: this.passingPath,            
            targetHex: context.coordinates,
            challengeHexes: this.challengeHexes
        }          
        this.store.dispatch(saveActionStepMeta(setPassingPathActionMeta));        
    }
}
