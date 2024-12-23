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
import { getPlayerPositions } from "../../../stores/player-position/player-position.selector";
import { take } from "rxjs";
import { equals, Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { TraverserService } from "../../traverser/traverser.service";
import { GridService } from "../../grid/grid.service";
import { IsMovingPathNotComplete } from "../../../actions/rules/move/is-moving-path-not-complete.rule";


@Injectable({
    providedIn: 'root',
})
export class SetMovingPathPointStep extends Step {    
    actionMeta!: MovingActionMeta;

    constructor(
        private store: Store,
        private grid: GridService,
        private traverser: TraverserService
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
        // TODO - refactor this is the same as we have in init-moving-step
        // TODO - extend with tacklable baller
        const centralPoint = this.context.hex;
        const playerSpeed = this.actionMeta.player?.speed || 0;   
        const distance = playerSpeed - (this.actionMeta.finalMovingPath!.toArray().length - 1);
        this.store.select(getPlayerPositions).pipe(take(1))
        .subscribe((occupiedCoordinates) => {
            const offsetCoordinates: OffsetCoordinates[] = Object.values(occupiedCoordinates)        
            const occupiedHexes = this.grid.createGrid()
                .setHexes(offsetCoordinates)
                .setHexes(this.grid.getFrame())
                .setHexes(this.actionMeta.finalMovingPath!.toArray());
            this.actionMeta.reachableHexes = this.traverser.getReachableHexes(centralPoint, distance, occupiedHexes)
        })
    }
    

    extendReachableHexesWithTacklableBaller(occupiedHexes: Grid<Hex>, reachableHexes: Grid<Hex>, centralPoint: Hex, distance: number) {
        if (!this.actionMeta.ballerAttackerHex) return reachableHexes
        
        const occupiedHexesWithoutBaller = occupiedHexes.filter(hex => !equals(hex, this.actionMeta.ballerAttackerHex!))
        const reachableHexesWithBaller = this.traverser.getReachableHexes(centralPoint, distance, occupiedHexesWithoutBaller)
        if (reachableHexesWithBaller.hasHex(this.actionMeta.ballerAttackerHex)) {
            reachableHexes.setHexes([this.actionMeta.ballerAttackerHex])
        }

        return reachableHexes
    }

    generateAvailableNextSteps() {        
        this.actionMeta.availableNextSteps = [FindMovingPathStep, SetMovingPathPointStep, MovePlayerStep];
    }

    updateState(): void {         
        this.store.dispatch(saveActionMeta(this.actionMeta));        
    }
}