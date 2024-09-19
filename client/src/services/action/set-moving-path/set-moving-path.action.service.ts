import { Injectable } from "@angular/core";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { Store } from "@ngrx/store";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { IsTheNextAction } from "../../../actions/rules/is-the-next-action.rule";
import { IsReachableHexClicked } from "../../../actions/rules/set-moving-path/is-reachable-hex-clicked.rule";
import { GridService } from "../../grid/grid.service";
import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { PickUpPlayerActionMeta } from "../../../actions/metas/pick-up-player.action.meta";
import { saveActionMeta } from "../../../stores/action/action.actions";

@Injectable({
    providedIn: 'root',
})
export class SetMovingPathAction implements ActionStrategy {
    ruleSet: ActionRuleSet;
    movingPath!: Grid<Hex>;

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
        const lastActionMeta = context.lastActionMeta as PickUpPlayerActionMeta;
        const startPoint: OffsetCoordinates = lastActionMeta.clickedCoordinates;
        const endPoint: OffsetCoordinates = context.coordinates;
        this.movingPath = this.grid.getHexesInPath(startPoint, endPoint);
    }

    triggerVisual(context: ActionContext): void {
        console.log("Vizuális réteg frissítése: útvonal megjelenítése.");
    }

    updateState(context: ActionContext): void {
        const pickUpPlayerActionMeta: PickUpPlayerActionMeta = {
            timestamp: new Date(),
            clickedCoordinates: context.coordinates,
            availableNextActions: [SetMovingPathAction],
            reachableHexes: this.movingPath
          }
          this.store.dispatch(saveActionMeta(pickUpPlayerActionMeta));
    }
}