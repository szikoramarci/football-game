import { Injectable, Type } from "@angular/core";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { Store } from "@ngrx/store";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { IsTheNextAction } from "../../../actions/rules/is-the-next-action.rule";
import { GridService } from "../../grid/grid.service";
import { Hex, OffsetCoordinates } from "honeycomb-grid";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { CancelAction } from "../cancel/cancel.service";
import { IsMouseOver } from "../../../actions/rules/is-mouse-over.rule";
import { InitPassingActionMeta } from "../../../actions/metas/init-passing.action.meta";
import { SetPassingPathActionMeta } from "../../../actions/metas/set-passing-path.action.meta";

@Injectable({
    providedIn: 'root',
})
export class SetPassingPathAction implements ActionStrategy {
    ruleSet: ActionRuleSet;
    passingPath!: Hex[];    
    lastActionMeta!: InitPassingActionMeta;
    availableNextActions: Type<ActionStrategy>[] = [];

    constructor(
        private store: Store,
        private grid: GridService
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
            this.generatePassingPath(context);
        } else {
            this.resetPassingPath();
        }
        this.generateAvailableNextActions(context);
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

    generateAvailableNextActions(context: ActionContext) {        
        this.availableNextActions = [SetPassingPathAction, CancelAction];
    }

    updateState(context: ActionContext): void {
        const setPassingPathActionMeta: SetPassingPathActionMeta = {... this.lastActionMeta,             
            timestamp: new Date(),
            availableNextActions: this.availableNextActions,
            clickedCoordinates: context.coordinates, 
            passingPath: this.passingPath,            
            targetHex: context.coordinates
        }          
        this.store.dispatch(saveActionMeta(setPassingPathActionMeta));        
    }
}