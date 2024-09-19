import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { filter, map } from "rxjs";
import { Grid, Hex } from "honeycomb-grid";
import { IndicatorComponent } from "../../indicator/indicator.component";
import { Container, Graphics } from "pixi.js";
import { AppService } from "../../../services/app/app.service";
import { getLastActionMeta } from "../../../stores/action/action.selector";
import { PickUpPlayerActionMeta } from "../../../actions/metas/pick-up-player.action.meta";

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
        private app: AppService
    ) {}
    
    ngOnInit(): void {
        this.app.addChild(this.container);
        this.store.select(getLastActionMeta()).pipe(
            filter((actionMeta): actionMeta is PickUpPlayerActionMeta => !!actionMeta),
            map(actionMeta => actionMeta.reachableHexes),
        ).subscribe(reachableHexes => {
            this.indicators = reachableHexes;
        });
    }

    handleGraphics(indicatorGraphics: Graphics) {
        this.container.addChild(indicatorGraphics);
    }
    
}