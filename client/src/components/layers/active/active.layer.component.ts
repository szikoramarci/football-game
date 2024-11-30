import { Component, OnInit } from "@angular/core";
import { MouseEventService } from "../../../services/mouse-event/mouse-event.service";
import { ActionService } from "../../../services/action/action.service";
import { ActionSelectorComponent } from "../../action-selector/action-selector.component";
import { PlayerService } from "../../../services/player/player.service";
import { BaseContext } from "../../../action-steps/classes/base-context.interface";
import { ActionContextService } from "../../../services/action-context/action-context.service";

@Component({
    selector: 'active-layer',
    standalone: true,
    imports: [ActionSelectorComponent],
    templateUrl: './active.layer.component.html',
})
export class ActiveLayerComponent implements OnInit {

    constructor(
        private mouseEvent: MouseEventService,
        private action: ActionService,
        private actionContext: ActionContextService,
        private player: PlayerService
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
            this.actionContext.generateActionContext(baseContext).subscribe(actionContext => {
                if (this.player.isSelectableForAction(actionContext)) {
                    this.action.setAvailableActions(actionContext)
                }               
            })         
        });
    }   

}