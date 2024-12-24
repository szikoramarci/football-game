import { Injectable } from "@angular/core";
import { Step } from "../../../actions/classes/step.class";
import { Store } from "@ngrx/store";
import { IsTheNextStep } from "../../../actions/rules/is-the-next-step.rule";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { MovingActionMeta } from "../../../actions/metas/moving.action-meta";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";
import { FindMovingPathStep } from "./find-moving-path.step";
import { IsReachableHexClicked } from "../../../actions/rules/move/is-reachable-hex-clicked.rule";
import { MovePlayerStep } from "./move-player.step";
import { IsNotLastPathPointClicked } from "../../../actions/rules/move/is-not-last-path-point-clicked.rule";
import { GridService } from "../../grid/grid.service";
import { IsMovingPathNotComplete } from "../../../actions/rules/move/is-moving-path-not-complete.rule";
import { MovingHelperService } from "../../action-helper/moving-helper.service";


@Injectable({
    providedIn: 'root',
})
export class SetMovingPathPointStep extends Step {    
    actionMeta!: MovingActionMeta;

    constructor(
        private store: Store,
        private grid: GridService,
        private movingHelper: MovingHelperService
    ) {
        super()
        this.initRuleSet()
    }

    initRuleSet(): void {
        this.addRule(new IsLeftClick());  
        this.addRule(new IsTheNextStep(SetMovingPathPointStep));   
        this.addRule(new IsReachableHexClicked());
        this.addRule(new IsNotLastPathPointClicked());
        this.addRule(new IsMovingPathNotComplete());
    } 

    calculation(): void {
        this.actionMeta = {...this.context.actionMeta as MovingActionMeta}

        this.actionMeta.pathPoints = [...this.actionMeta.pathPoints, this.context.hex]
        this.actionMeta.finalMovingPath = this.grid.createGrid().setHexes(this.actionMeta.possibleMovingPath?.toArray() || [])

        this.generateReachableHexes();
        this.generateAvailableNextSteps();
    }

    generateReachableHexes() {
        const centralPoint = this.context.hex;
        const playerSpeed = this.actionMeta.player?.speed || 0;   
        const distance = playerSpeed - (this.actionMeta.finalMovingPath!.toArray().length - 1);
        this.actionMeta.reachableHexes = this.movingHelper.generateReachableHexes(centralPoint, distance, this.actionMeta.ballerAttackerHex!, this.actionMeta.finalMovingPath)      
    }

    generateAvailableNextSteps() {        
        this.actionMeta.availableNextSteps = [FindMovingPathStep, SetMovingPathPointStep, MovePlayerStep];
    }

    updateState(): void {         
        this.store.dispatch(saveActionMeta(this.actionMeta));        
    }
}