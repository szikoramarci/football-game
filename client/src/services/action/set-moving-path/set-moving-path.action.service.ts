import { Injectable } from "@angular/core";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { Store } from "@ngrx/store";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { IsTheNextAction } from "../../../actions/rules/is-the-next-action.rule";
import { IsReachableHexClicked } from "../../../actions/rules/set-moving-path/is-reachable-hex-clicked.rule";
import { GridService } from "../../grid/grid.service";
import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { SetMovingPathActionMeta } from "../../../actions/metas/set-moving-path.action.meta";
import { PickUpPlayerActionMeta } from "../../../actions/metas/pick-up-player.action.meta";

@Injectable({
    providedIn: 'root',
})
export class SetMovingPathAction implements ActionStrategy {
    ruleSet: ActionRuleSet;
    movingPath!: Grid<Hex>;
    lastActionMeta!: PickUpPlayerActionMeta;

    constructor(
        private store: Store,
        private grid: GridService
    ) {
        this.ruleSet = new ActionRuleSet();    
        this.ruleSet.addRule(new IsTheNextAction(SetMovingPathAction));    
        this.ruleSet.addRule(new IsReachableHexClicked());
    }

    identify(context: ActionContext): boolean {
        return this.ruleSet.validate(context);
    }

    calculation(context: ActionContext): void {
        this.lastActionMeta = context.lastActionMeta as PickUpPlayerActionMeta;
        const startPoint: OffsetCoordinates = this.lastActionMeta.playerCoordinates;
        const endPoint: OffsetCoordinates = context.coordinates;
        this.movingPath = this.grid.getPathHexes(startPoint, endPoint);
    }

    updateState(context: ActionContext): void {
        const setMovingPathActionMeta: SetMovingPathActionMeta = {... this.lastActionMeta,
            timestamp: new Date(),
            clickedCoordinates: context.coordinates, 
            movingPath: this.movingPath
          }          
          this.store.dispatch(saveActionMeta(setMovingPathActionMeta));
    }
}