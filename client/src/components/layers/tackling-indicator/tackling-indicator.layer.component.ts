import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Grid, Hex } from "honeycomb-grid";
import { IndicatorComponent } from "../../indicator/indicator.component";
import { Container, Graphics, GraphicsContext } from "pixi.js";
import { AppService } from "../../../services/app/app.service";
import { getCurrentActionMeta } from "../../../stores/action/action.selector";
import { MovementPathComponent } from "../../movement-path/movement-path.component";
import { GridService } from "../../../services/grid/grid.service";
import { ActionMeta } from "../../../actions/classes/action-meta.interface";
import { PIXIContextService } from "../../../services/pixi-context/pixi-context.service";
import { TacklingActionMeta } from "../../../actions/metas/tackling.action-meta";

@Component({
    selector: 'tackling-indicator-layer',
    standalone: true,
    imports: [IndicatorComponent, MovementPathComponent],
    templateUrl: './tackling-indicator.layer.component.html',
})
export class TacklingIndicatorLayerComponent implements OnInit {
    indicators!: Grid<Hex>;
    movingPath!: Grid<Hex>;

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
                
        this.store.select(getCurrentActionMeta()).subscribe(actionMeta => {     
            this.resetElements();

            this.handlePossibleTacklingHexes(actionMeta);
            this.handleMovingPath(actionMeta);       
        });        
    }

    resetElements() {
        this.indicators = this.grid.createGrid();
        this.movingPath = this.grid.createGrid();
    }

    handleMovingPath(actionMeta: ActionMeta | undefined) {
        if (!actionMeta) return;

        const tacklingActionMeta = actionMeta as TacklingActionMeta;
        if (tacklingActionMeta.movingPath) {
            this.movingPath = tacklingActionMeta.movingPath
        }
    }

    handlePossibleTacklingHexes(actionMeta: ActionMeta | undefined) {
        if (!actionMeta) return;

        const tacklingActionMeta = actionMeta as TacklingActionMeta;
        if (tacklingActionMeta.possibleTacklingHexes) {
            this.indicators = tacklingActionMeta.possibleTacklingHexes
        }        
    }    

    handleGraphics(indicatorGraphics: Graphics) {
        this.container.addChild(indicatorGraphics);
    }
    
}