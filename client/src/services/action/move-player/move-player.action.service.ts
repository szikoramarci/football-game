import { Injectable } from "@angular/core";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { SetMovingPathActionMeta } from "../../../actions/metas/set-moving-path.action.meta";
import { IsTheNextAction } from "../../../actions/rules/is-the-next-action.rule";
import { IsTargetHexClicked } from "../../../actions/rules/move-player/is-target-hex-clicked.rule";
import { Store } from "@ngrx/store";
import { clearActionMeta } from "../../../stores/action/action.actions";
import { movePlayer } from "../../../stores/player-position/player-position.actions";
import { OffsetCoordinates } from "honeycomb-grid";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";

@Injectable({
    providedIn: 'root',
})
export class MovePlayerAction implements ActionStrategy {
    ruleSet: ActionRuleSet;
    lastActionMeta!: SetMovingPathActionMeta;
    playerID!: string;
    newPosition!: OffsetCoordinates;

    constructor(private store: Store) {
        this.ruleSet = new ActionRuleSet();   
        this.ruleSet.addRule(new IsLeftClick());
        this.ruleSet.addRule(new IsTheNextAction(MovePlayerAction));    
        this.ruleSet.addRule(new IsTargetHexClicked()); 
    }

    identify(context: ActionContext): boolean {
        return this.ruleSet.validate(context);
    }

    calculation(context: ActionContext): void {
        this.lastActionMeta = context.lastActionMeta as SetMovingPathActionMeta;
        this.newPosition = context.coordinates;
        if (this.lastActionMeta.playerID) {
            this.playerID = this.lastActionMeta.playerID
        } else {
            console.log("Invalid player.");
        }
    }

    updateState(context: ActionContext): void {
        this.store.dispatch(clearActionMeta());
        this.store.dispatch(movePlayer({
            playerID: this.playerID, 
            position: this.newPosition
        }));
    }    
}