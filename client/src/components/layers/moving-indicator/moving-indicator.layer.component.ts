import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Grid, Hex } from "honeycomb-grid";
import { IndicatorComponent } from "../../indicator/indicator.component";
import { Container, Graphics, GraphicsContext } from "pixi.js";
import { AppService } from "../../../services/app/app.service";
import { getCurrentActionMeta } from "../../../stores/action/action.selector";
import { MovementPathComponent } from "../../movement-path/movement-path.component";
import { GridService } from "../../../services/grid/grid.service";
import { MovingActionMeta } from "../../../actions/metas/moving.action-meta";
import { ActionMeta } from "../../../actions/classes/action-meta.interface";
import { PIXIContextService } from "../../../services/pixi-context/pixi-context.service";
@Component({
    selector: 'moving-indicator-layer',
    standalone: true,
    imports: [IndicatorComponent, MovementPathComponent],
    templateUrl: './moving-indicator.layer.component.html',
})
export class MovingIndicatorLayerComponent implements OnInit {
    indicators!: Grid<Hex>;
    movingPath!: Grid<Hex>;
    challengeHexes!: Grid<Hex>;

    movementGraphicsContext!: GraphicsContext
    challengeGraphicsContext!: GraphicsContext

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
        this.challengeGraphicsContext = this.context.getChallengeIndicatorContext();

        this.app.addChild(this.container);
                
        this.store.select(getCurrentActionMeta()).subscribe(actionMeta => {     
            this.resetElements();

            this.handleReachableHexes(actionMeta);
            this.handleMovingPath(actionMeta);       
            this.handleChallengeHexes(actionMeta);   
        });        
    }

    resetElements() {
        this.indicators = this.grid.createGrid();
        this.movingPath = this.grid.createGrid();
        this.challengeHexes = this.grid.createGrid();
    }

    handleMovingPath(actionMeta: ActionMeta | undefined) {
        if (!actionMeta) return;

        const initMovingActionMeta = actionMeta as MovingActionMeta;
        if (initMovingActionMeta.reachableHexes) {
            this.indicators = initMovingActionMeta.reachableHexes
        }
    }

    handleReachableHexes(actionMeta: ActionMeta | undefined) {
        if (!actionMeta) return;

        const movingActionMeta = actionMeta as MovingActionMeta;
        if (movingActionMeta.possibleMovingPath) {
            this.movingPath = movingActionMeta.possibleMovingPath
        }        
    }

    handleChallengeHexes(actionMeta: ActionMeta | undefined) {
        if (!actionMeta) return;

        const movingActionMeta = actionMeta as MovingActionMeta;
        if (movingActionMeta.challengeHexes) {
            this.challengeHexes.setHexes(movingActionMeta.challengeHexes.values());
        }       
    }    

    handleGraphics(indicatorGraphics: Graphics) {
        this.container.addChild(indicatorGraphics);
    }
    
}