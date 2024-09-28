import { Injectable, Type } from "@angular/core";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { Store } from "@ngrx/store";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { IsTheNextAction } from "../../../actions/rules/is-the-next-action.rule";
import { GridService } from "../../grid/grid.service";
import { OffsetCoordinates } from "honeycomb-grid";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { CancelAction } from "../cancel/cancel.service";
import { IsMouseOver } from "../../../actions/rules/is-mouse-over.rule";
import { IsPassTargetHexClicked } from "../../../actions/rules/set-passing-path/is-pass-target-hex-clicked.rule";
import { InitPassingActionMeta } from "../../../actions/metas/init-passing.action.meta";
import { SetPassingPathActionMeta } from "../../../actions/metas/set-passing-path.action.meta";
import { Point } from "pixi.js";

@Injectable({
    providedIn: 'root',
})
export class SetPassingPathAction implements ActionStrategy {
    ruleSet: ActionRuleSet;
    passingPath!: Point[];
    lastActionMeta!: InitPassingActionMeta;
    availableNextActions: Type<ActionStrategy>[] = [];

    constructor(
        private store: Store,
        private grid: GridService
    ) {
        this.ruleSet = new ActionRuleSet();   
        this.ruleSet.addRule(new IsMouseOver());  
        this.ruleSet.addRule(new IsTheNextAction(SetPassingPathAction));           
        this.ruleSet.addRule(new IsPassTargetHexClicked());
    }

    identify(context: ActionContext): boolean {
        return this.ruleSet.validate(context);
    }

    calculation(context: ActionContext): void {
        this.lastActionMeta = context.lastActionMeta as InitPassingActionMeta;

        this.generatePassingPath(context);
        this.generateAvailableNextActions(context);
    }

    generatePassingPath(context: ActionContext) {        
        const startCoordinate: OffsetCoordinates = this.lastActionMeta.playerCoordinates;
        const startHex = this.grid.getHex(startCoordinate);
        const endCoordinate: OffsetCoordinates = context.coordinates;            
        const endHex = this.grid.getHex(endCoordinate);        
        if (startHex && endHex) {
            const startPoint = new Point(startHex.x, startHex.y)
            const endPoint = new Point(endHex.x, endHex.y)
            this.passingPath = [startPoint, endPoint];
        }          
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