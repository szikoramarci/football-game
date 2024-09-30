import { Injectable, Type } from "@angular/core";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { Store } from "@ngrx/store";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { IsTheNextAction } from "../../../actions/rules/is-the-next-action.rule";
import { GridService } from "../../grid/grid.service";
import { HexCoordinates, OffsetCoordinates } from "honeycomb-grid";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { CancelAction } from "../cancel/cancel.service";
import { IsMouseOver } from "../../../actions/rules/is-mouse-over.rule";
import { IsPassTargetHexClicked } from "../../../actions/rules/pass/is-pass-target-hex-clicked.rule";
import { InitPassingActionMeta } from "../../../actions/metas/init-passing.action.meta";
import { SetPassingPathActionMeta } from "../../../actions/metas/set-passing-path.action.meta";
import { Point } from "pixi.js";
import { DrawService } from "../../draw/draw.service";
import { STANDARD_PASS_PIXEL_DISTANCE } from "../../../constants";
import { selectOppositeTeamPlayersWithPositions } from "../../../stores/gameplay/gameplay.selector";
import { of, switchMap, take } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class SetPassingPathAction implements ActionStrategy {
    ruleSet: ActionRuleSet;
    passingPath!: Point[];
    isPassingPathValid!: boolean;
    lastActionMeta!: InitPassingActionMeta;
    availableNextActions: Type<ActionStrategy>[] = [];

    constructor(
        private store: Store,
        private grid: GridService,
        private draw: DrawService
    ) {
        this.ruleSet = new ActionRuleSet();   
        this.ruleSet.addRule(new IsMouseOver());  
        this.ruleSet.addRule(new IsTheNextAction(SetPassingPathAction));                   
    }

    identify(context: ActionContext): boolean {
        return this.ruleSet.validate(context);
    }

    filterOutPlayersByRange(passerPosition: HexCoordinates, targetPosition: HexCoordinates): boolean {
        const distanceInPixels = this.grid.getHexCenterDistanceInPixels(passerPosition, targetPosition)
        return distanceInPixels && distanceInPixels < STANDARD_PASS_PIXEL_DISTANCE || false
    }

    getPossiblyObstacleOppositeTeamPlayers(context: ActionContext) {
        return this.store.select(selectOppositeTeamPlayersWithPositions).pipe(
            take(1),
            switchMap(players => {
            return of(players            
                .filter(targetPlayer => this.filterOutPlayersByRange(context.coordinates, targetPlayer.position))) // FILTER FOR RANGE    
            })
        )
    }

    calculation(context: ActionContext): void {
        this.lastActionMeta = context.lastActionMeta as InitPassingActionMeta;

        this.isPassingPathValid = false;
        if (this.lastActionMeta.availableTargets.getHex(context.coordinates)) {
            this.getPossiblyObstacleOppositeTeamPlayers(context).subscribe(oppositionTeamPlayers => {
                const passingPathInHexes = this.grid.getDirectLine(this.lastActionMeta.playerCoordinates, context.coordinates, context.mousePosition)
                if (oppositionTeamPlayers.every(oppositionTeamPlayer => !passingPathInHexes.getHex(oppositionTeamPlayer.position))) {
                    this.isPassingPathValid = true;
                }
            });
        }

        this.generatePassingPath(context);
        this.generateAvailableNextActions(context);
    }

    generatePassingPath(context: ActionContext) {        
        const startCoordinate: OffsetCoordinates = this.lastActionMeta.playerCoordinates;
        const startHex = this.grid.getHex(startCoordinate);         
        if (startHex) {
            const startPoint = new Point(startHex.x, startHex.y)
            const endPoint = context.mousePosition
            if (this.isPositionInRange(startPoint, endPoint)) {
                this.passingPath = [startPoint, endPoint];
            } else {
                this.passingPath = [];
            }
        }          
    }

    isPositionInRange(startPoint: Point, endPoint: Point): boolean {
        const distanceInPixels = this.draw.calculatePointDistance(startPoint, endPoint)
        return distanceInPixels && distanceInPixels < STANDARD_PASS_PIXEL_DISTANCE || false
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
            isPassingPathValid: this.isPassingPathValid,
            targetHex: context.coordinates
        }          
        this.store.dispatch(saveActionMeta(setPassingPathActionMeta));        
    }
}