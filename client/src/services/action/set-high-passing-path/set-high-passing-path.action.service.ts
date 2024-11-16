import { Injectable, Type } from "@angular/core";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { Store } from "@ngrx/store";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { IsTheNextAction } from "../../../actions/rules/is-the-next-action.rule";
import { GridService } from "../../grid/grid.service";
import { equals, Hex, OffsetCoordinates, reachable } from "honeycomb-grid";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { CancelAction } from "../cancel/cancel.service";
import { IsMouseOver } from "../../../actions/rules/is-mouse-over.rule";
import { InitPassingActionMeta } from "../../../actions/metas/init-passing.action.meta";
import { GeometryService } from "../../geometry/geometry.service";
import { TraverserService } from "../../traverser/traverser.service";
import { SetHighPassingPathActionMeta } from "../../../actions/metas/set-high-passing-path.action.meta";
import { InitHighPassingActionMeta } from "../../../actions/metas/init-high-passing.action.meta";
import { eq } from "lodash";

@Injectable({
    providedIn: 'root',
})
export class SetHighPassingPathAction implements ActionStrategy {
    ruleSet: ActionRuleSet
    passingPath!: Hex[]
    lastActionMeta!: InitHighPassingActionMeta
    availableNextActions: Type<ActionStrategy>[] = []

    constructor(
        private store: Store,
        private grid: GridService
    ) {
        this.ruleSet = new ActionRuleSet();   
        this.ruleSet.addRule(new IsMouseOver());  
        this.ruleSet.addRule(new IsTheNextAction(SetHighPassingPathAction));                   
    }

    identify(context: ActionContext): boolean {
        return this.ruleSet.validate(context);
    }

    calculation(context: ActionContext): void {
        this.lastActionMeta = context.lastActionMeta as InitHighPassingActionMeta;

        if (this.isSelectedHexPassable(context)) {
            this.collectPossibleHeadingPlayer(context)
            this.generatePassingPath(context)
        } else {
            this.resetPassingPath()
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

    resetPassingPath() {
        this.passingPath = []
    }

    collectPossibleHeadingPlayer(context: ActionContext) {
        this.lastActionMeta.possibleHeadingPlayers.forEach((availableTargets, playerPosition) => {
            if (availableTargets.some(availableTarget => equals(availableTarget, context.coordinates))) {
                console.log(playerPosition)
            }
        })
    }

    generateAvailableNextActions() {        
        this.availableNextActions = [SetHighPassingPathAction, CancelAction];
    }

    updateState(context: ActionContext): void {
        const setHighPassingPathActionMeta: SetHighPassingPathActionMeta = {... this.lastActionMeta,             
            timestamp: new Date(),
            availableNextActions: this.availableNextActions,
            clickedCoordinates: context.coordinates, 
            passingPath: this.passingPath,            
            targetHex: context.coordinates,
        }          
        this.store.dispatch(saveActionMeta(setHighPassingPathActionMeta));        
    }
}
