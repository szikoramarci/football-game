import { Component, OnInit } from "@angular/core";
import { MouseEventService } from "../../../services/mouse-event/mouse-event.service";
import { ActionSelectorComponent } from "../../action-selector/action-selector.component";
import { BaseContext } from "../../../actions/classes/base-context.interface";
import { GameContextService } from "../../../services/game-context/game-context.service";

@Component({
    selector: 'active-layer',
    standalone: true,
    imports: [ActionSelectorComponent],
    templateUrl: './active.layer.component.html',
})
export class ActiveLayerComponent implements OnInit {

    constructor(
        private mouseEvent: MouseEventService,
        private gameContext: GameContextService
    ) {}

    ngOnInit(): void {
        this.initMouseEventSubscriptions();
    }

    initMouseEventSubscriptions() {
        this.mouseEvent.getMouseEvents().subscribe(mouseEvent => { 
            // IS ACTIVE ACTION?
            const isActiveAction = false
            if (isActiveAction) {
                console.log('aaa')
            } else {
            const baseContext: BaseContext = {
                mouseEventType: mouseEvent.type,
                hex: mouseEvent.hex,
            }
            this.gameContext.generateGameContext(baseContext).subscribe(gameContext => {   
                const selectableActions = gameContext.availableActions.filter(availableAction => {
                    const action = new availableAction()                    
                    return action.identify(gameContext)
                })                
                console.log(selectableActions)
            })     
            }            
        });
    }   

}