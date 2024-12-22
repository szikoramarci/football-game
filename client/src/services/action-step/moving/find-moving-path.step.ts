import { Injectable } from "@angular/core";
import { Step } from "../../../actions/classes/step.class";
import { Store } from "@ngrx/store";
import { IsTheNextStep } from "../../../actions/rules/is-the-next-step.rule";
import { GridService } from "../../grid/grid.service";
import { OffsetCoordinates } from "honeycomb-grid";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { IsMouseOver } from "../../../actions/rules/is-mouse-over.rule";
import { getPlayerPositions } from "../../../stores/player-position/player-position.selector";
import { take } from "rxjs";
import { MovingActionMeta } from "../../../actions/metas/moving.action-meta";
import { TraverserService } from "../../traverser/traverser.service";
import { ChallengeService } from "../../challenge/challenge.service";
import { MovePlayerStep } from "./move-player.step";
import { SetMovingPathPointStep } from "./set-moving-path-point.step.";
import { IsReachableHexClicked } from "../../../actions/rules/move/is-reachable-hex-clicked.rule";


@Injectable({
    providedIn: 'root',
})
export class FindMovingPathStep extends Step {    
    actionMeta!: MovingActionMeta;

    constructor(
        private store: Store,
        private grid: GridService,
        private traverser: TraverserService,
        private challenge: ChallengeService
    ) {
        super()
        this.initRuleSet()
    }

    initRuleSet(): void {
        this.addRule(new IsMouseOver());  
        this.addRule(new IsTheNextStep(FindMovingPathStep));
        this.addRule(new IsReachableHexClicked());
    } 

    calculation(): void {
        this.actionMeta = {...this.context.actionMeta as MovingActionMeta}

        if (this.isSelectedHexReachable()) {
            this.generateMovingPath();
            this.generateChallengeHexes();            
        } else {
            this.resetMovingPath();
            this.resetChallengeHexes();            
        }
        this.generateAvailableNextSteps();
    }

    isSelectedHexReachable() {
        const selectedPoint: OffsetCoordinates = this.context.hex;
        return this.actionMeta.reachableHexes.getHex(selectedPoint) || false
    }

    generateMovingPath() { 
        const playerPosition: OffsetCoordinates = this.actionMeta.playerHex;
        const hoveredPosition: OffsetCoordinates = this.context.hex;  
        const pathPoints: OffsetCoordinates[] = [playerPosition, ...this.actionMeta.pathPoints, hoveredPosition];              
        this.store.select(getPlayerPositions).pipe(take(1))
        .subscribe((occupiedCoordinates) => {
            const offsetCoordinates: OffsetCoordinates[] = Object.values(occupiedCoordinates)        
            const occupiedHexes = this.grid.createGrid().setHexes(offsetCoordinates).setHexes(this.grid.getFrame());     
            this.actionMeta.movingPath = this.grid.createGrid();        
            for (let i = 0; i < pathPoints.length - 1; i++) {
                const startPoint = pathPoints[i];
                const endPoint = pathPoints[i + 1];
                this.actionMeta.movingPath?.setHexes(this.traverser.getPathHexes(startPoint, endPoint, occupiedHexes));
            }            
        })
    }

    generateChallengeHexes() {
        this.resetChallengeHexes();

        if (!this.actionMeta.playerHasBall) {
            return
        }

        this.actionMeta.challengeHexes = this.challenge.generateChallengeHexes(this.actionMeta.movingPath!.toArray(), 1)         
    }

    resetMovingPath() {
        this.actionMeta.movingPath = this.grid.createGrid();
    }

    resetChallengeHexes() {
        this.actionMeta.challengeHexes = new Map();
    }

    generateAvailableNextSteps() {        
        this.actionMeta.availableNextSteps = [FindMovingPathStep, SetMovingPathPointStep, MovePlayerStep];
    }

    updateState(): void {         
        this.store.dispatch(saveActionMeta(this.actionMeta));        
    }
}