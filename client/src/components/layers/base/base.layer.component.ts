import { Component, OnInit } from "@angular/core";
import { GridService } from "../../../services/grid/grid.service";
import { Hex } from "honeycomb-grid";
import { Container, Graphics } from "pixi.js";
import { AppService } from "../../../services/app/app.service";
import { FieldComponent } from "../../field/field.component";

@Component({
    selector: 'base-layer',
    standalone: true,
    imports: [FieldComponent],
    templateUrl: './base.layer.component.html',
})
export class BaseLayerComponent implements OnInit {
    fields!: Hex[];

    container: Container = new Container({
        interactiveChildren: false,
        isRenderGroup:true
    }); 

    constructor(
        private grid: GridService,
        private app: AppService
    ) {}

    ngOnInit() {
        this.fields = this.grid.getGrid().toArray();
        this.app.addChild(this.container);
    }

    handleGraphics(fieldGraphics: Graphics) {
        this.container.addChild(fieldGraphics);
    }
}