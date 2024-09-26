import { Injectable, Type } from "@angular/core";
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
import { MovePlayerAction } from "../move-player/move-player.action.service";
import { IsNotTargetHexClicked } from "../../../actions/rules/set-moving-path/is-not-target-hex-clicked.rule";
import { CancelAction } from "../cancel/cancel.service";
import { IsMouseOver } from "../../../actions/rules/is-mouse-over.rule";
import { playerMovementEvents } from "../../../stores/player-position/player-position.selector";
import { take } from "rxjs";
import { InitMovingActionMeta } from "../../../actions/metas/init-moving.action.meta";
import { InitPassingAction } from "../init-passing/init-passing.action.service";

@Injectable({
    providedIn: 'root',
})
export class SetMovingPathAction implements ActionStrategy {
    ruleSet: ActionRuleSet;
    movingPath!: Grid<Hex>;
    lastActionMeta!: InitMovingActionMeta;
    availableNextActions: Type<ActionStrategy>[] = [];

    constructor(
        private store: Store,
        private grid: GridService
    ) {
        this.ruleSet = new ActionRuleSet();   
        this.ruleSet.addRule(new IsMouseOver());  
        this.ruleSet.addRule(new IsTheNextAction(SetMovingPathAction));           
        this.ruleSet.addRule(new IsReachableHexClicked());
        this.ruleSet.addRule(new IsNotTargetHexClicked());
    }

    identify(context: ActionContext): boolean {
        return this.ruleSet.validate(context);
    }

    calculation(context: ActionContext): void {
        this.lastActionMeta = context.lastActionMeta as InitMovingActionMeta;

        this.generateMovingPath(context);
        this.generateAvailableNextActions(context);
    }

    generateMovingPath(context: ActionContext) {        
        const startPoint: OffsetCoordinates = this.lastActionMeta.playerCoordinates;
        const endPoint: OffsetCoordinates = context.coordinates;        
        this.store.select(playerMovementEvents).pipe(take(1))
        .subscribe((occupiedCoordinates) => {
            const offsetCoordinates: OffsetCoordinates[] = Object.values(occupiedCoordinates)        
            const occupiedHexes = this.grid.createGrid().setHexes(offsetCoordinates).setHexes(this.grid.getFrame());         
            this.movingPath = this.grid.getPathHexes(startPoint, endPoint, occupiedHexes);
        })
    }

    generateAvailableNextActions(context: ActionContext) {        
        this.availableNextActions = [SetMovingPathAction, MovePlayerAction];

        if (this.lastActionMeta.playerHasBall){
            this.availableNextActions.push(InitPassingAction);
        } else {
            this.availableNextActions.push(CancelAction);
        }
    }

    updateState(context: ActionContext): void {
        const setMovingPathActionMeta: SetMovingPathActionMeta = {... this.lastActionMeta,             
            timestamp: new Date(),
            availableNextActions: this.availableNextActions,
            clickedCoordinates: context.coordinates, 
            movingPath: this.movingPath,
            targetHex: context.coordinates
        }          
        this.store.dispatch(saveActionMeta(setMovingPathActionMeta));        
    }
}