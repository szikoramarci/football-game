import { Component, OnInit } from "@angular/core";
import { Hex } from "honeycomb-grid";
import { Container, Graphics } from "pixi.js";
import { AppService } from "../../../services/app/app.service";
import { RelocationService } from "../../../services/relocation/relocation.service";
import { PlayerStrokeComponent } from "../../player-stroke/player-stroke.component";

@Component({
    selector: 'selection-indicator-layer',
    standalone: true,
    imports: [PlayerStrokeComponent],
    templateUrl: './selection-indicator.layer.component.html',
})
export class SelectionIndicatorLayerComponent implements OnInit {
    selectablePositions: Hex[] = []

    container: Container = new Container({
        interactiveChildren: false,
        isRenderGroup: true
    }); 

    constructor(
        private relocation: RelocationService,
        private app: AppService
    ) {}
    
    ngOnInit(): void {
        this.app.addChild(this.container);

        this.relocation.getSelectableHexes().subscribe(selectablePositions => {
            this.selectablePositions = selectablePositions
        })                   
    }

    handleGraphics(indicatorGraphics: Graphics) {
        this.container.addChild(indicatorGraphics);
    }
    
}