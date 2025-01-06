import { Component, OnInit } from "@angular/core";
import { IndicatorComponent } from "../../../indicator/indicator.component";
import { Container, Graphics, GraphicsContext } from "pixi.js";
import { AppService } from "../../../../services/app/app.service";
import { Store } from "@ngrx/store";
import { getCurrentActionMeta } from "../../../../stores/action/action.selector";
import { filter, tap } from "rxjs";
import { IsRelocationActionMeta, RelocationActionMeta } from "../../../../actions/metas/relocation.action-meta";
import { GridService } from "../../../../services/grid/grid.service";
import { Grid, Hex } from "honeycomb-grid";
import { PIXIContextService } from "../../../../services/pixi-context/pixi-context.service";

@Component({
    selector: 'relocation-indicator-layer',
    standalone: true,
    imports: [IndicatorComponent],
    templateUrl: './relocation-indicator.layer.component.html',
})
export class RelocationIndicatorLayerComponent implements OnInit {
    indicators!: Grid<Hex>
    movementGraphicsContext!: GraphicsContext

    container: Container = new Container({
        interactiveChildren: false,
        isRenderGroup: true
    }); 

    constructor(
        private store: Store,
        private app: AppService,
        private grid: GridService,
        private context: PIXIContextService
    ) {}

    ngOnInit(): void {
        this.movementGraphicsContext = this.context.getMovementIndicatorContext();

        this.app.addChild(this.container);
                
        this.store.select(getCurrentActionMeta())
        .pipe(
            tap(() => this.resetElements()),
            filter(actionMeta => actionMeta != undefined),
            filter((actionMeta): actionMeta is RelocationActionMeta => IsRelocationActionMeta(actionMeta))
        )
        .subscribe(actionMeta => {   
            this.handleReachableHexes(actionMeta); 
        })     
    }

    resetElements() {
        this.indicators = this.grid.createGrid();
    }

    handleReachableHexes(movingActionMeta: RelocationActionMeta) {
        if (movingActionMeta.reachableHexes) {
            this.indicators = movingActionMeta.reachableHexes
        }
    }

    handleGraphics(indicatorGraphics: Graphics) {
        this.container.addChild(indicatorGraphics);
    }

}