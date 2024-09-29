import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Grid, Hex } from "honeycomb-grid";
import { IndicatorComponent } from "../../indicator/indicator.component";
import { Container, Graphics } from "pixi.js";
import { AppService } from "../../../services/app/app.service";
import { getLastActionMeta } from "../../../stores/action/action.selector";
import { SetMovingPathActionMeta } from "../../../actions/metas/set-moving-path.action.meta";
import { MovementPathComponent } from "../../movement-path/movement-path.component";
import { GridService } from "../../../services/grid/grid.service";
import { InitMovingActionMeta } from "../../../actions/metas/init-moving.action.meta";
import { ActionMeta } from "../../../actions/interfaces/action.meta.interface";
@Component({
    selector: 'moving-indicator-layer',
    standalone: true,
    imports: [IndicatorComponent, MovementPathComponent],
    templateUrl: './moving-indicator.layer.component.html',
})
export class MovingIndicatorLayerComponent implements OnInit {
    indicators!: Grid<Hex>;
    movingPath!: Grid<Hex>;

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

            this.handleReachableHexes(actionMeta);
            this.handleMovingPath(actionMeta);          
        });

    }

    resetElements() {
        this.indicators = this.grid.createGrid();
        this.movingPath = this.grid.createGrid();
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