import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { filter, map } from "rxjs";
import { Grid, Hex } from "honeycomb-grid";
import { IndicatorComponent } from "../../indicator/indicator.component";
import { Container, Graphics } from "pixi.js";
import { AppService } from "../../../services/app/app.service";
import { getLastActionMeta } from "../../../stores/action/action.selector";
import { PickUpPlayerActionMeta } from "../../../actions/metas/pick-up-player.action.meta";
import { SetMovingPathActionMeta } from "../../../actions/metas/set-moving-path.action.meta";
import { MovementPathComponent } from "../../movement-path/movement-path.component";
import { GridService } from "../../../services/grid/grid.service";

@Component({
    selector: 'indicator-layer',
    standalone: true,
    imports: [IndicatorComponent, MovementPathComponent],
    templateUrl: './indicator.layer.component.html',
})
export class IndicatorLayerComponent implements OnInit {
    indicators!: Grid<Hex>;
    movingPath!: Grid<Hex>;

    container: Container = new Container(); 

    constructor(
        private store: Store,
        private app: AppService,
        private grid: GridService
    ) {}
    
    ngOnInit(): void {
        this.app.addChild(this.container);
        
        this.store.select(getLastActionMeta()).pipe(
            filter((actionMeta): actionMeta is PickUpPlayerActionMeta => !!actionMeta),
            map(actionMeta => actionMeta.reachableHexes),
        ).subscribe(reachableHexes => {
            this.indicators = reachableHexes;
        });

        this.store.select(getLastActionMeta()).pipe(
            filter((actionMeta): actionMeta is SetMovingPathActionMeta => !!actionMeta),
        ).subscribe(actionMeta => {            
            this.indicators = actionMeta.reachableHexes;
            this.movingPath = actionMeta.movingPath;
        });

        this.store.select(getLastActionMeta()).pipe(
            filter(actionMeta => !actionMeta)
        ).subscribe(actionMeta => {
            this.indicators = this.grid.createGrid();
            this.movingPath = this.grid.createGrid();
        });
    }

    handleGraphics(indicatorGraphics: Graphics) {
        this.container.addChild(indicatorGraphics);
    }
    
}