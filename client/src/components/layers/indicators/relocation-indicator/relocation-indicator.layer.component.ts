import { Component, OnInit } from "@angular/core";
import { IndicatorComponent } from "../../../indicator/indicator.component";
import { Container, Graphics, GraphicsContext } from "pixi.js";
import { AppService } from "../../../../services/app/app.service";
import { Store } from "@ngrx/store";
import { getCurrentActionMeta } from "../../../../stores/action/action.selector";
import { filter, tap } from "rxjs";
import { IsRelocationActionMeta, RelocationActionMeta } from "../../../../actions/metas/relocation.action-meta";
import { GridService } from "../../../../services/grid/grid.service";
import { Grid, Hex } from "@szikoramarci/honeycomb-grid";
import { PIXIContextService } from "../../../../services/pixi-context/pixi-context.service";
import { Player } from "../../../../models/player.model";
import { PlayerTokenComponent } from "../../../player-token/player-token.component";

@Component({
    selector: 'relocation-indicator-layer',
    standalone: true,
    imports: [IndicatorComponent, PlayerTokenComponent],
    templateUrl: './relocation-indicator.layer.component.html',
})
export class RelocationIndicatorLayerComponent implements OnInit {
    indicators!: Grid<Hex>
    targetHex!: Hex | undefined
    selectedPlayer!: Player | undefined

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
            this.handleTargetHex(actionMeta)
            this.handlePlayer(actionMeta)
        })     
    }

    resetElements() {
        this.indicators = this.grid.createGrid();
        this.selectedPlayer = undefined
        this.targetHex = undefined
    }

    handleReachableHexes(movingActionMeta: RelocationActionMeta) {
        if (movingActionMeta.reachableHexes) {
            this.indicators = movingActionMeta.reachableHexes
        }
    }

    handleTargetHex(movingActionMeta: RelocationActionMeta) {
        if (movingActionMeta.targetHex) {
            this.targetHex = movingActionMeta.targetHex
        }
    }

    handlePlayer(movingActionMeta: RelocationActionMeta) {
        if (movingActionMeta.player) {
            this.selectedPlayer = movingActionMeta.player
        }
    }

    handleGraphics(indicatorGraphics: Graphics | Container) {
        this.container.addChild(indicatorGraphics);
    }

}