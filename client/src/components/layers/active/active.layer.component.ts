import { Component, OnInit } from "@angular/core";
import { MouseEventService } from "../../../services/mouse-event/mouse-event.service";
import { StepService } from "../../../services/action-step/step.service";
import { ActionSelectorComponent } from "../../action-selector/action-selector.component";
import { StepContextService } from "../../../services/step-context/step-context.service";
import { BaseContext } from "../../../action-steps/classes/base-context.interface";

@Component({
    selector: 'active-layer',
    standalone: true,
    imports: [ActionSelectorComponent],
    templateUrl: './active.layer.component.html',
})
export class ActiveLayerComponent implements OnInit {

    constructor(
        private mouseEvent: MouseEventService,
        private stepContext: StepContextService,
        private action: StepService
    ) {}

    ngOnInit(): void {
        this.initMouseEventSubscriptions();
    }

    initMouseEventSubscriptions() {
        this.mouseEvent.getMouseEvents().subscribe(mouseEvent => {           
            const baseContext: BaseContext = {
                mouseEventType: mouseEvent.type,
                coordinates: mouseEvent.coordinates,
                mousePosition: mouseEvent.position
            }
            this.stepContext.generateStepContext(baseContext).subscribe(stepContext => {
                const availableAction = this.action.resolveStep(stepContext);                       
                if (availableAction) {
                    this.action.executeStep(availableAction,stepContext);
                }   
            })           
        });
    }   

}