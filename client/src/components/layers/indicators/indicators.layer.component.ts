import { Component } from "@angular/core";
import { MovingIndicatorLayerComponent } from "./moving-indicator/moving-indicator.layer.component";
import { PassingIndicatorLayerComponent } from "./passing-indicator/passing-indicator.layer.component";
import { SelectionIndicatorLayerComponent } from "./selection-indicator/selection-indicator.layer.component";
import { TacklingIndicatorLayerComponent } from "./tackling-indicator/tackling-indicator.layer.component";
import { RelocationIndicatorLayerComponent } from "./relocation-indicator/relocation-indicator.layer.component";

@Component({
    selector: 'indicators-layer',
    standalone: true,
    imports: [
        RelocationIndicatorLayerComponent,
        MovingIndicatorLayerComponent,
        PassingIndicatorLayerComponent,
        SelectionIndicatorLayerComponent,
        TacklingIndicatorLayerComponent
    ],
    templateUrl: './indicators.layer.component.html',
})
export class IndicatorsLayerComponent {

}