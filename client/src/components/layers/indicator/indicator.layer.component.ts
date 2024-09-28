import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { IndicatorComponent } from "../../indicator/indicator.component";
import { Container, Graphics, Point } from "pixi.js";
import { AppService } from "../../../services/app/app.service";
import { getLastActionMeta } from "../../../stores/action/action.selector";
import { SetMovingPathActionMeta } from "../../../actions/metas/set-moving-path.action.meta";
import { MovementPathComponent } from "../../movement-path/movement-path.component";
import { GridService } from "../../../services/grid/grid.service";
import { InitMovingActionMeta } from "../../../actions/metas/init-moving.action.meta";
import { InitPassingActionMeta } from "../../../actions/metas/init-passing.action.meta";
import { ActionMeta } from "../../../actions/interfaces/action.meta.interface";
import { PassingRangeComponent } from "../../passing-range/passing-range.components";
import { SetPassingPathActionMeta } from "../../../actions/metas/set-passing-path.action.meta";
import { PassingPathComponent } from "../../passing-path/passing-path.component";

@Component({
    selector: 'indicator-layer',
    standalone: true,
    imports: [IndicatorComponent, MovementPathComponent, PassingRangeComponent, PassingPathComponent],
    templateUrl: './indicator.layer.component.html',
})
export class IndicatorLayerComponent implements OnInit {
    indicators!: Grid<Hex>;
    movingPath!: Grid<Hex>;
    passerCoordinates!: OffsetCoordinates | null;
    passingPath!: Point[] | null

    container: Container = new Container({
        interactiveChildren: false,
        isRenderGroup: true
    }); 

    constructor(
        private store: Store,
        private app: AppService,
        private grid: GridService
    ) {}
    
    ngOnInit(): void {
        this.app.addChild(this.container);
                
        this.store.select(getLastActionMeta()).subscribe(actionMeta => {     
            this.resetElements();

            this.handleAvailableTargets(actionMeta);
            this.handlePassingPath(actionMeta);
            this.handleReachableHexes(actionMeta);
            this.handleMovingPath(actionMeta);          
        });

    }

    resetElements() {
        this.indicators = this.grid.createGrid();
        this.movingPath = this.grid.createGrid();
        this.passerCoordinates = null;
        this.passingPath = null;
    }

    handleAvailableTargets(actionMeta: ActionMeta | undefined) {
        if (!actionMeta) return;

        const initPassingActionMeta = actionMeta as InitPassingActionMeta;
        if (initPassingActionMeta.availableTargets) {
            this.indicators = initPassingActionMeta.availableTargets   
            this.passerCoordinates = initPassingActionMeta.playerCoordinates  
        }
    }

    handlePassingPath(actionMeta: ActionMeta | undefined) {
        if (!actionMeta) return;

        const setPassingPathActionMeta = actionMeta as SetPassingPathActionMeta;
        if (setPassingPathActionMeta.availableTargets && setPassingPathActionMeta.passingPath) {
            this.indicators = setPassingPathActionMeta.availableTargets
            this.passerCoordinates = setPassingPathActionMeta.playerCoordinates  
            this.passingPath = setPassingPathActionMeta.passingPath 
        }
    }

    handleMovingPath(actionMeta: ActionMeta | undefined) {
        if (!actionMeta) return;

        const initMovingActionMeta = actionMeta as InitMovingActionMeta;
        if (initMovingActionMeta.reachableHexes) {
            this.indicators = initMovingActionMeta.reachableHexes
        }
    }

    handleReachableHexes(actionMeta: ActionMeta | undefined) {
        if (!actionMeta) return;

        const setMovingPathActionMeta = actionMeta as SetMovingPathActionMeta;
        if (setMovingPathActionMeta.movingPath) {
            this.movingPath = setMovingPathActionMeta.movingPath
        }
    }

    handleGraphics(indicatorGraphics: Graphics) {
        this.container.addChild(indicatorGraphics);
    }
    
}