import { Injectable, Type } from "@angular/core";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { Store } from "@ngrx/store";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { IsTheNextAction } from "../../../actions/rules/is-the-next-action.rule";
import { GridService } from "../../grid/grid.service";
import { Direction, Hex, neighborOf, OffsetCoordinates, Point } from "honeycomb-grid";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { CancelAction } from "../cancel/cancel.service";
import { IsMouseOver } from "../../../actions/rules/is-mouse-over.rule";
import { InitPassingActionMeta } from "../../../actions/metas/init-passing.action.meta";
import { SetPassingPathActionMeta } from "../../../actions/metas/set-passing-path.action.meta";
import { GeometryService } from "../../geometry/geometry.service";
import { Sector } from "../../../interfaces/sector.interface";
import { HEXA_RADIUS, HEXA_WIDTH, STANDARD_PASS_HEX_DISTANCE, STANDARD_PASS_PIXEL_DISTANCE } from "../../../constants";
import { TraverserService } from "../../traverser/traverser.service";

@Injectable({
    providedIn: 'root',
})
export class SetPassingPathAction implements ActionStrategy {
    ruleSet: ActionRuleSet
    passingPath!: Hex[]
    challengeHexes!: Map<string,Hex>
    lastActionMeta!: InitPassingActionMeta
    availableNextActions: Type<ActionStrategy>[] = []
    testPoints: Point[] = []

    constructor(
        private store: Store,
        private grid: GridService,
        private geometry: GeometryService,
        private traverser: TraverserService
    ) {
        this.ruleSet = new ActionRuleSet();   
        this.ruleSet.addRule(new IsMouseOver());  
        this.ruleSet.addRule(new IsTheNextAction(SetPassingPathAction));                   
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

    generateChallengeHexes() {
        this.resetChallengeHexes();

        this.testPoints = [];

        const startHex: Hex = this.passingPath[0]
        const endHex: Hex = this.passingPath[1]
        const rectangle = this.geometry.offsetLineToRectangle(startHex, endHex, HEXA_WIDTH/2*1.0000001)

        // TODO ez a basic lefedet vonal - ezt kell szűrni a szomszéd ellenfelek első találkozására
        this.traverser.getAreaByDistance(
            startHex, 
            STANDARD_PASS_HEX_DISTANCE,
            STANDARD_PASS_PIXEL_DISTANCE
        ).filter(availableTarget => {
            return this.geometry.isPointInRectangle(availableTarget, rectangle)
        }).forEach(availableTarget => {
            const id: string = availableTarget.col.toString() + " - " + availableTarget.row.toString()
            this.challengeHexes.set(id, availableTarget)
        })
    }

    resetPassingPath() {
        this.passingPath = []
    }

    resetChallengeHexes() {
        this.challengeHexes = new Map();
    }

    generateAvailableNextActions() {        
        this.availableNextActions = [SetPassingPathAction, CancelAction];
    }

    updateState(context: ActionContext): void {
        const setPassingPathActionMeta: SetPassingPathActionMeta = {... this.lastActionMeta,             
            timestamp: new Date(),
            availableNextActions: this.availableNextActions,
            clickedCoordinates: context.coordinates, 
            passingPath: this.passingPath,            
            targetHex: context.coordinates,
            challengeHexes: this.challengeHexes,
            testPoints: this.testPoints
        }          
        this.store.dispatch(saveActionMeta(setPassingPathActionMeta));        
    }
}