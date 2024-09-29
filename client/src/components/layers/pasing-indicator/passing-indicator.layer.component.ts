import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { OffsetCoordinates } from "honeycomb-grid";
import { IndicatorComponent } from "../../indicator/indicator.component";
import { Container, Graphics, Point } from "pixi.js";
import { AppService } from "../../../services/app/app.service";
import { getLastActionMeta } from "../../../stores/action/action.selector";
import { SetMovingPathActionMeta } from "../../../actions/metas/set-moving-path.action.meta";
import { GridService } from "../../../services/grid/grid.service";
import { InitMovingActionMeta } from "../../../actions/metas/init-moving.action.meta";
import { InitPassingActionMeta } from "../../../actions/metas/init-passing.action.meta";
import { ActionMeta } from "../../../actions/interfaces/action.meta.interface";
import { PassingRangeComponent } from "../../passing-range/passing-range.components";
import { SetPassingPathActionMeta } from "../../../actions/metas/set-passing-path.action.meta";
import { PassingPathComponent } from "../../passing-path/passing-path.component";

@Component({
    selector: 'passing-indicator-layer',
    standalone: true,
    imports: [IndicatorComponent, PassingRangeComponent, PassingPathComponent],
    templateUrl: './passing-indicator.layer.component.html',
})
export class PasingIndicatorLayerComponent implements OnInit {
    passerPosition!: OffsetCoordinates | null;
    passingPath!: Point[] | null
    isPassingPathValid!: boolean    

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
        });

    }

    resetElements() {        
        this.passerPosition = null;
        this.passingPath = null;
        this.isPassingPathValid = false
    }

    handleAvailableTargets(actionMeta: ActionMeta | undefined) {
        if (!actionMeta) return;

        const initPassingActionMeta = actionMeta as InitPassingActionMeta;
        if (initPassingActionMeta.availableTargets) {
            this.passerPosition = initPassingActionMeta.playerCoordinates  
        }
    }

    handlePassingPath(actionMeta: ActionMeta | undefined) {
        if (!actionMeta) return;

        const setPassingPathActionMeta = actionMeta as SetPassingPathActionMeta;
        if (setPassingPathActionMeta.availableTargets && setPassingPathActionMeta.passingPath) {
            this.passerPosition = setPassingPathActionMeta.playerCoordinates  
            this.passingPath = setPassingPathActionMeta.passingPath 
            this.isPassingPathValid = setPassingPathActionMeta.isPassingPathValid
        }
    }

    handleGraphics(indicatorGraphics: Graphics) {
        this.container.addChild(indicatorGraphics);
    }
    
}