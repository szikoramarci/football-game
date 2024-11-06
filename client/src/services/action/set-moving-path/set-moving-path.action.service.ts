import { Injectable, Type } from "@angular/core";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { Store } from "@ngrx/store";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { IsTheNextAction } from "../../../actions/rules/is-the-next-action.rule";
import { GridService } from "../../grid/grid.service";
import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { SetMovingPathActionMeta } from "../../../actions/metas/set-moving-path.action.meta";
import { MovePlayerAction } from "../move-player/move-player.action.service";
import { IsNotTargetHexClicked } from "../../../actions/rules/move/is-not-target-hex-clicked.rule";
import { CancelAction } from "../cancel/cancel.service";
import { IsMouseOver } from "../../../actions/rules/is-mouse-over.rule";
import { playerMovementEvents } from "../../../stores/player-position/player-position.selector";
import { take } from "rxjs";
import { InitMovingActionMeta } from "../../../actions/metas/init-moving.action.meta";
import { InitStandardPassingAction } from "../init-standard-passing/init-standard-passing.action.service";
import { TraverserService } from "../../traverser/traverser.service";
import { ChallengeService } from "../../challenge/challenge.service";

@Injectable({
    providedIn: 'root',
})
export class SetMovingPathAction implements ActionStrategy {
    ruleSet: ActionRuleSet;
    movingPath!: Grid<Hex>;
    lastActionMeta!: InitMovingActionMeta;
    availableNextActions: Type<ActionStrategy>[] = [];
    challengeHexes: Map<string,Hex> = new Map()

    constructor(
        private store: Store,
        private grid: GridService,
        private traverser: TraverserService,
        private challenge: ChallengeService
    ) {
        this.ruleSet = new ActionRuleSet();   
        this.ruleSet.addRule(new IsMouseOver());  
        this.ruleSet.addRule(new IsTheNextAction(SetMovingPathAction));       
        this.ruleSet.addRule(new IsNotTargetHexClicked());
    }

    identify(context: ActionContext): boolean {
        return this.ruleSet.validate(context);
    }    

    calculation(context: ActionContext): void {
        this.lastActionMeta = context.lastActionMeta as InitMovingActionMeta;

        if (this.isSelectedHexReachable(context)) {
            this.generateMovingPath(context);
            this.generateChallengeHexes();
        } else {
            this.resetMovingPath();
            this.resetChallengeHexes();
        }
        this.generateAvailableNextActions(context);
    }

    isSelectedHexReachable(context: ActionContext) {
        const selectedPoint: OffsetCoordinates = context.coordinates;
        return this.lastActionMeta.reachableHexes.getHex(selectedPoint) || false
    }

    generateMovingPath(context: ActionContext) { 
        const startPoint: OffsetCoordinates = this.lastActionMeta.playerCoordinates;
        const endPoint: OffsetCoordinates = context.coordinates;        
        this.store.select(playerMovementEvents).pipe(take(1))
        .subscribe((occupiedCoordinates) => {
            const offsetCoordinates: OffsetCoordinates[] = Object.values(occupiedCoordinates)        
            const occupiedHexes = this.grid.createGrid().setHexes(offsetCoordinates).setHexes(this.grid.getFrame());         
            this.movingPath = this.traverser.getPathHexes(startPoint, endPoint, occupiedHexes);
        })
    }

    generateChallengeHexes() {
        this.resetChallengeHexes();

        if (!this.lastActionMeta.playerHasBall) {
            return
        }

        this.challenge.generateChallengeHexes(this.movingPath.toArray(), 1).subscribe(challengeHexes => {
            this.challengeHexes = challengeHexes
        })         
    }

    resetMovingPath() {
        this.movingPath = this.grid.createGrid();
    }

    resetChallengeHexes() {
        this.challengeHexes = new Map();
    }

    generateAvailableNextActions(context: ActionContext) {        
        this.availableNextActions = [SetMovingPathAction, CancelAction];

        if (this.lastActionMeta.playerHasBall){
            this.availableNextActions.push(InitStandardPassingAction);
        } 

        if (this.isSelectedHexReachable(context)) {
            this.availableNextActions.push(MovePlayerAction)
        }
    }

    updateState(context: ActionContext): void {
        const setMovingPathActionMeta: SetMovingPathActionMeta = {... this.lastActionMeta,             
            timestamp: new Date(),
            availableNextActions: this.availableNextActions,
            clickedCoordinates: context.coordinates, 
            movingPath: this.movingPath,
            targetHex: context.coordinates,
            challengeHexes: this.challengeHexes
        }          
        this.store.dispatch(saveActionMeta(setMovingPathActionMeta));        
    }
}