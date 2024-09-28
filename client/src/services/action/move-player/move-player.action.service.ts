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
import { Grid, Hex, hexToOffset, OffsetCoordinates } from "honeycomb-grid";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";
import { concatMap, delay, from, of } from "rxjs";
import { IsTargetHexNotThePlayerHex } from "../../../actions/rules/move-player/is-target-hex-not-the-player-hex.rule";
import { moveBall } from "../../../stores/ball-position/ball-position.actions";

@Injectable({
    providedIn: 'root',
})
export class MovePlayerAction implements ActionStrategy {
    ruleSet: ActionRuleSet;
    lastActionMeta!: SetMovingPathActionMeta;
    playerID!: string;
    movingPath!: Grid<Hex>;

    constructor(private store: Store) {
        this.ruleSet = new ActionRuleSet();   
        this.ruleSet.addRule(new IsLeftClick());
        this.ruleSet.addRule(new IsTheNextAction(MovePlayerAction));    
        this.ruleSet.addRule(new IsTargetHexClicked()); 
        this.ruleSet.addRule(new IsTargetHexNotThePlayerHex()); 
    }

    identify(context: ActionContext): boolean {
        return this.ruleSet.validate(context);
    }

    calculation(context: ActionContext): void {
        this.lastActionMeta = context.lastActionMeta as SetMovingPathActionMeta;
        this.movingPath = this.lastActionMeta.movingPath;
        if (this.lastActionMeta.playerID) {
            this.playerID = this.lastActionMeta.playerID
        } else {
            console.log("Invalid player.");
        }
    }

    updateState(context: ActionContext): void {
        const lastActionMeta = context.lastActionMeta as SetMovingPathActionMeta;                
        from(this.movingPath.toArray())
            .pipe(
                concatMap((position, index) => 
                    index === 0 
                        ? of(position)  // No delay for the first action
                        : of(position).pipe(delay(350)) // Delay for the rest
                )
            )
            .subscribe(newPosition => {
                const newCoordinates = hexToOffset(newPosition)
                this.store.dispatch(movePlayer({
                    playerID: this.playerID, 
                    position: newCoordinates
                }));        
                if (lastActionMeta.playerHasBall) {
                    this.store.dispatch(moveBall(newCoordinates));
                }
            })
        this.store.dispatch(clearActionMeta());                
    }    
}