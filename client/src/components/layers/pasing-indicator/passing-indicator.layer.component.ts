import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { Container, Graphics, GraphicsContext } from "pixi.js";
import { AppService } from "../../../services/app/app.service";
import { getLastStepMeta } from "../../../stores/action/action.selector";
import { InitPassingStepMeta } from "../../../actions/metas/passing/init-passing.step-meta";
import { StepMeta } from "../../../actions/classes/step-meta.interface";
import { SetStandardPassingPathStepMeta } from "../../../actions/metas/passing/standard-passing/set-standard-passing-path.step-meta";
import { PassingPathComponent } from "../../passing-path/passing-path.component";
import { PlayerStrokeComponent } from "../../player-stroke/player-stroke.component";
import { IndicatorComponent } from "../../indicator/indicator.component";
import { PIXIContextService } from "../../../services/pixi-context/pixi-context.service";

@Component({
    selector: 'passing-indicator-layer',
    standalone: true,
    imports: [IndicatorComponent, PlayerStrokeComponent, PassingPathComponent],
    templateUrl: './passing-indicator.layer.component.html',
})
export class PasingIndicatorLayerComponent implements OnInit {
    passerPosition!: OffsetCoordinates | null
    passingPath!: Hex[] | null
    challengeHexes!: Grid<Hex>
    availableTargets!: Grid<Hex> | null    
    
    passingGraphicsContext!: GraphicsContext
    challengeGraphicsContext!: GraphicsContext

    container: Container = new Container({
        interactiveChildren: false,
        isRenderGroup: true
    }); 

    constructor(
        private store: Store,
        private app: AppService,
        private context: PIXIContextService
    ) {}
    
    ngOnInit(): void {
        this.passingGraphicsContext = this.context.getPassingIndicatorContext()
        this.challengeGraphicsContext = this.context.getChallengeIndicatorContext()

        this.app.addChild(this.container);
                
        this.store.select(getLastStepMeta()).subscribe(actionMeta => {     
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

    handleAvailableTargets(actionMeta: StepMeta | undefined) {
        if (!actionMeta) return;

        const initPassingActionMeta = actionMeta as InitPassingStepMeta;
        if (initPassingActionMeta.availableTargets) {
            this.passerPosition = initPassingActionMeta.playerHex  
            this.availableTargets = initPassingActionMeta.availableTargets
        }
    }

    handlePassingPath(actionMeta: StepMeta | undefined) {
        if (!actionMeta) return;

        const setPassingPathActionMeta = actionMeta as SetStandardPassingPathStepMeta;
        if (setPassingPathActionMeta.availableTargets && setPassingPathActionMeta.passingPath) {
            this.passerPosition = setPassingPathActionMeta.playerHex  
            this.passingPath = setPassingPathActionMeta.passingPath             
            this.availableTargets = setPassingPathActionMeta.availableTargets
        }
    }

    handleChallengeHexes(actionMeta: StepMeta | undefined) {
        if (!actionMeta) return;

        const setMovingPathActionMeta = actionMeta as SetStandardPassingPathStepMeta;
        if (setMovingPathActionMeta.challengeHexes) {
            this.challengeHexes.setHexes(setMovingPathActionMeta.challengeHexes.values());
        }       
    }  

    handleGraphics(indicatorGraphics: Graphics) {
        this.container.addChild(indicatorGraphics);
    }
    
}