import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { getActiveAction } from "../../../stores/action/action.selector";
import { ActionType } from "../../../actions/action.type.enum";
import { filter, map } from "rxjs";
import { GridService } from "../../../services/grid/grid.service";
import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { IndicatorComponent } from "../../indicator/indicator.component";
import { Container, Graphics } from "pixi.js";
import { AppService } from "../../../services/app/app.service";

@Component({
    selector: 'indicator-layer',
    standalone: true,
    imports: [IndicatorComponent],
    templateUrl: './indicator.layer.component.html',
})
export class IndicatorLayerComponent implements OnInit {
    indicators!: Grid<Hex>;

    container: Container = new Container(); 

    constructor(
        private store: Store,
        private grid: GridService,
        private app: AppService
    ) {}
    
    ngOnInit(): void {
        this.app.addChild(this.container);
        this.store.select(getActiveAction()).pipe(
            filter(action => !!action),
            filter(action => action.actionType == ActionType.PickPlayer),
            map(action => action.context),
        ).subscribe(context => {
            const coordinates: OffsetCoordinates = context.coordinates;
            const distance: number = context.player?.speed || 0;
            this.indicators = this.grid.getReachableArea(coordinates, distance);
        });
    }

    handleGraphics(indicatorGraphics: Graphics) {
        this.container.addChild(indicatorGraphics);
    }
    
}