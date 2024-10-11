import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { Container, Graphics, Point } from "pixi.js";
import { AppService } from "../../../services/app/app.service";
import { getLastActionMeta } from "../../../stores/action/action.selector";
import { GridService } from "../../../services/grid/grid.service";
import { InitPassingActionMeta } from "../../../actions/metas/init-passing.action.meta";
import { ActionMeta } from "../../../actions/interfaces/action.meta.interface";
import { SetPassingPathActionMeta } from "../../../actions/metas/set-passing-path.action.meta";
import { PassingPathComponent } from "../../passing-path/passing-path.component";
import { PlayerStrokeComponent } from "../../player-stroke/player-stroke.component";
import { IndicatorComponent } from "../../indicator/indicator.component";
import { DrawService } from "../../../services/draw/draw.service";

@Component({
    selector: 'passing-indicator-layer',
    standalone: true,
    imports: [IndicatorComponent, PlayerStrokeComponent, PassingPathComponent],
    templateUrl: './passing-indicator.layer.component.html',
})
export class PasingIndicatorLayerComponent implements OnInit {
    passerPosition!: OffsetCoordinates | null
    passingPath!: Hex[] | null
    availableTargets!: Grid<Hex> | null

    container: Container = new Container({
        interactiveChildren: false,
        isRenderGroup: true
    }); 

    constructor(
        private store: Store,
        private app: AppService,
        private draw: DrawService
    ) {}
    
    ngOnInit(): void {
        this.app.addChild(this.container);
                
        this.store.select(getLastActionMeta()).subscribe(actionMeta => {     
            this.resetElements();

            this.handleAvailableTargets(actionMeta);
            this.handlePassingPath(actionMeta);       
        });

    }

    resetElements() {        
        this.passerPosition = null;
        this.passingPath = null;        
        this.availableTargets = null;
    }

    handleAvailableTargets(actionMeta: ActionMeta | undefined) {
        if (!actionMeta) return;

        const initPassingActionMeta = actionMeta as InitPassingActionMeta;
        if (initPassingActionMeta.availableTargets) {
            this.passerPosition = initPassingActionMeta.playerCoordinates  
            this.availableTargets = initPassingActionMeta.availableTargets

            initPassingActionMeta.edgePoints?.forEach(edgePoints => {
                const gr = new Graphics();
                const points = [
                    new Point(edgePoints[0].x, edgePoints[0].y),
                    new Point(edgePoints[1].x, edgePoints[1].y)
                ]
                this.draw.drawLine(gr, points)
                this.container.addChild(gr);
            })
        }
    }

    handlePassingPath(actionMeta: ActionMeta | undefined) {
        if (!actionMeta) return;

        const setPassingPathActionMeta = actionMeta as SetPassingPathActionMeta;
        if (setPassingPathActionMeta.availableTargets && setPassingPathActionMeta.passingPath) {
            this.passerPosition = setPassingPathActionMeta.playerCoordinates  
            this.passingPath = setPassingPathActionMeta.passingPath             
            this.availableTargets = setPassingPathActionMeta.availableTargets
        }
    }

    handleGraphics(indicatorGraphics: Graphics) {
        this.container.addChild(indicatorGraphics);
    }
    
}