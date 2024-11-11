import { Injectable, Type } from "@angular/core";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { Store } from "@ngrx/store";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { IsTheNextAction } from "../../../actions/rules/is-the-next-action.rule";
import { GridService } from "../../grid/grid.service";
import { equals, Hex, OffsetCoordinates } from "honeycomb-grid";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { CancelAction } from "../cancel/cancel.service";
import { IsMouseOver } from "../../../actions/rules/is-mouse-over.rule";
import { InitPassingActionMeta } from "../../../actions/metas/init-passing.action.meta";
import { SetStandardPassingPathActionMeta } from "../../../actions/metas/set-standard-passing-path.action.meta";
import { GeometryService } from "../../geometry/geometry.service";
import { HEXA_WIDTH, STANDARD_PASS_HEX_DISTANCE, STANDARD_PASS_PIXEL_DISTANCE } from "../../../constants";
import { TraverserService } from "../../traverser/traverser.service";
import { ChallengeService } from "../../challenge/challenge.service";
import { selectActiveTeamPlayersWithPositions } from "../../../stores/gameplay/gameplay.selector";
import { filter, from, Observable, toArray, switchMap, take } from "rxjs";
import { InitHighPassingAction } from "../init-high-passing/init-high-passing.action.service";

@Injectable({
    providedIn: 'root',
})
export class SetStandardPassingPathAction implements ActionStrategy {
    ruleSet: ActionRuleSet
    passingPath!: Hex[]
    challengeHexes!: Map<string,Hex>
    lastActionMeta!: InitPassingActionMeta
    availableNextActions: Type<ActionStrategy>[] = []

    constructor(
        private store: Store,
        private grid: GridService,
        private geometry: GeometryService,
        private traverser: TraverserService,
        private challenge: ChallengeService
    ) {
        this.ruleSet = new ActionRuleSet();   
        this.ruleSet.addRule(new IsMouseOver());  
        this.ruleSet.addRule(new IsTheNextAction(SetStandardPassingPathAction));                   
    }

    identify(context: ActionContext): boolean {
        return this.ruleSet.validate(context);
    }

    calculation(context: ActionContext): void {
        this.lastActionMeta = context.lastActionMeta as InitPassingActionMeta;

        if (this.isSelectedHexPassable(context)) {
            this.generatePassingPath(context)
            this.generateChallengeHexes()
        } else {
            this.resetPassingPath()
            this.resetChallengeHexes()
        }
        this.generateAvailableNextActions()
    }

    isSelectedHexPassable(context: ActionContext) {
        const selectedPoint: OffsetCoordinates = context.coordinates;
        return this.lastActionMeta.availableTargets.getHex(selectedPoint) || false
    }

    generatePassingPath(context: ActionContext) {  
        const startCoordinate: OffsetCoordinates = this.lastActionMeta.playerCoordinates;       
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

    generateAvailableNextActions() {        
        this.availableNextActions = [SetStandardPassingPathAction, InitHighPassingAction, CancelAction];
    }

    updateState(context: ActionContext): void {
        const setPassingPathActionMeta: SetStandardPassingPathActionMeta = {... this.lastActionMeta,             
            timestamp: new Date(),
            availableNextActions: this.availableNextActions,
            clickedCoordinates: context.coordinates, 
            passingPath: this.passingPath,            
            targetHex: context.coordinates,
            challengeHexes: this.challengeHexes
        }          
        this.store.dispatch(saveActionMeta(setPassingPathActionMeta));        
    }
}
