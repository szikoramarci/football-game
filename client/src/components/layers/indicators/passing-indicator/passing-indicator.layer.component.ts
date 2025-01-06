import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Grid, Hex, OffsetCoordinates } from "honeycomb-grid";
import { Container, Graphics, GraphicsContext } from "pixi.js";
import { AppService } from "../../../../services/app/app.service";
import { getCurrentActionMeta } from "../../../../stores/action/action.selector";
import { IsStandardPassActionMeta, StandardPassActionMeta } from "../../../../actions/metas/standard-pass.action-meta";
import { PassingPathComponent } from "../../../passing-path/passing-path.component";
import { IndicatorComponent } from "../../../indicator/indicator.component";
import { PIXIContextService } from "../../../../services/pixi-context/pixi-context.service";
import { HighPassActionMeta, IsHighPassActionMeta } from "../../../../actions/metas/high-pass.action-meta";
import { filter, tap } from "rxjs";

@Component({
    selector: 'passing-indicator-layer',
    standalone: true,
    imports: [IndicatorComponent, PassingPathComponent],
    templateUrl: './passing-indicator.layer.component.html',
})
export class PassingIndicatorLayerComponent implements OnInit {
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
                
        this.store.select(getCurrentActionMeta())
        .pipe(
            tap(() => this.resetElements()),
            filter(actionMeta => actionMeta != undefined),
            filter((actionMeta): actionMeta is StandardPassActionMeta | HighPassActionMeta => IsStandardPassActionMeta(actionMeta) || IsHighPassActionMeta(actionMeta))
        )
        .subscribe(actionMeta => {   
            this.handleAvailableTargets(actionMeta);
            this.handlePassingPath(actionMeta);       
        });        
    }

    resetElements() {        
        this.passerPosition = null;
        this.passingPath = null;        
        this.availableTargets = null;
    }

    handleAvailableTargets(passingActionMeta: StandardPassActionMeta | HighPassActionMeta) {
        if (passingActionMeta.availableTargets) {
            this.passerPosition = passingActionMeta.playerHex  
            this.availableTargets = passingActionMeta.availableTargets
        }
    }

    handlePassingPath(passingActionMeta: StandardPassActionMeta) {
        if (passingActionMeta.availableTargets && passingActionMeta.passingPath) {
            this.passerPosition = passingActionMeta.playerHex  
            this.passingPath = passingActionMeta.passingPath             
            this.availableTargets = passingActionMeta.availableTargets
        }
    }

    handleChallengeHexes(passingActionMeta: StandardPassActionMeta) {
        if (passingActionMeta.challengeHexes) {
            this.challengeHexes.setHexes(passingActionMeta.challengeHexes.values());
        }       
    }  

    handleGraphics(indicatorGraphics: Graphics) {
        this.container.addChild(indicatorGraphics);
    }
    
}