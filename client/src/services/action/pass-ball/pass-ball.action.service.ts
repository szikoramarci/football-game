import { Injectable } from "@angular/core";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { SetMovingPathActionMeta } from "../../../actions/metas/set-moving-path.action.meta";
import { IsTheNextAction } from "../../../actions/rules/is-the-next-action.rule";
import { IsMoveTargetHexClicked } from "../../../actions/rules/move/is-move-target-hex-clicked.rule";
import { Store } from "@ngrx/store";
import { clearActionMeta } from "../../../stores/action/action.actions";
import { movePlayer } from "../../../stores/player-position/player-position.actions";
import { Grid, Hex, hexToOffset, OffsetCoordinates } from "honeycomb-grid";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";
import { concatMap, delay, from, of } from "rxjs";
import { IsTargetHexNotThePlayerHex } from "../../../actions/rules/move/is-target-hex-not-the-player-hex.rule";
import { moveBall } from "../../../stores/ball-position/ball-position.actions";
import { SetPassingPathAction } from "../set-passing-path/set-passing-path.action.service";
import { IsPassTargetHexClicked } from "../../../actions/rules/pass/is-pass-target-hex-clicked.rule";
import { SetPassingPathActionMeta } from "../../../actions/metas/set-passing-path.action.meta";

@Injectable({
    providedIn: 'root',
})
export class PassBallAction implements ActionStrategy {
    ruleSet: ActionRuleSet;

    constructor(private store: Store) {
        this.ruleSet = new ActionRuleSet();   
        this.ruleSet.addRule(new IsLeftClick());
        this.ruleSet.addRule(new IsTheNextAction(SetPassingPathAction));    
        this.ruleSet.addRule(new IsPassTargetHexClicked()); 
    }

    identify(context: ActionContext): boolean {
        return this.ruleSet.validate(context);
    }

    calculation(context: ActionContext): void {
           
    }

    updateState(context: ActionContext): void {                  
        this.store.dispatch(moveBall(context.coordinates));
        this.store.dispatch(clearActionMeta());                
    }    
}