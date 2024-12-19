import { Injectable } from "@angular/core";
import { Step } from "../../../actions/classes/step.class";
import { Store } from "@ngrx/store";
import { IsTheNextStep } from "../../../actions/rules/is-the-next-step.rule";
import { GridService } from "../../grid/grid.service";
import { OffsetCoordinates } from "honeycomb-grid";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { IsNotTargetHexClicked } from "../../../actions/rules/move/is-not-target-hex-clicked.rule";
import { IsMouseOver } from "../../../actions/rules/is-mouse-over.rule";
import { getPlayerPositions } from "../../../stores/player-position/player-position.selector";
import { take } from "rxjs";
import { MovingActionMeta } from "../../../actions/metas/moving.action-meta";
import { TraverserService } from "../../traverser/traverser.service";
import { ChallengeService } from "../../challenge/challenge.service";
import { MovePlayerStep } from "./move-player.step";


@Injectable({
    providedIn: 'root',
})
export class SetMovingPathStep extends Step {    
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
        this.addRule(new IsTheNextStep(SetMovingPathStep));       
        this.addRule(new IsNotTargetHexClicked());
    } 

    calculation(): void {
        this.actionMeta = {...this.context.actionMeta as MovingActionMeta}

        if (this.isSelectedHexReachable()) {
            this.setTargetHex()
            this.generateMovingPath();
            this.generateChallengeHexes();            
        } else {
            this.resetTargetHex()
            this.resetMovingPath();
            this.resetChallengeHexes();            
        }
        this.generateAvailableNextSteps();
    }

    setTargetHex() {
        this.actionMeta.targetHex = this.context.hex
    }    

    isSelectedHexReachable() {
        const selectedPoint: OffsetCoordinates = this.context.hex;
        return this.actionMeta.reachableHexes.getHex(selectedPoint) || false
    }

    generateMovingPath() { 
        const startPoint: OffsetCoordinates = this.actionMeta.playerHex;
        const endPoint: OffsetCoordinates = this.context.hex;        
        this.store.select(getPlayerPositions).pipe(take(1))
        .subscribe((occupiedCoordinates) => {
            const offsetCoordinates: OffsetCoordinates[] = Object.values(occupiedCoordinates)        
            const occupiedHexes = this.grid.createGrid().setHexes(offsetCoordinates).setHexes(this.grid.getFrame());                     
            this.actionMeta.movingPath = this.traverser.getPathHexes(startPoint, endPoint, occupiedHexes);
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

    resetTargetHex() {
        this.actionMeta.targetHex = undefined
    }

    generateAvailableNextSteps() {        
        this.actionMeta.availableNextSteps = [SetMovingPathStep];

        if (this.isSelectedHexReachable()) {
            this.actionMeta.availableNextSteps.push(MovePlayerStep)
        }
    }

    updateState(): void {         
        this.store.dispatch(saveActionMeta(this.actionMeta));        
    }
}