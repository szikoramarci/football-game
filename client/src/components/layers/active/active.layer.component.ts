import { Component, Injector, OnInit, Type } from "@angular/core";
import { MouseEventService } from "../../../services/mouse-event/mouse-event.service";
import { ActionSelectorComponent } from "../../action-selector/action-selector.component";
import { BaseContext } from "../../../actions/classes/base-context.interface";
import { GameContextService } from "../../../services/game-context/game-context.service";
import { Store } from "@ngrx/store";
import { clearStepMeta, setCurrentAction, setSelectableActions } from "../../../stores/action/action.actions";
import { getCurrentAction } from "../../../stores/action/action.selector";
import { Action } from "../../../actions/classes/action.class";
import { filter } from "rxjs";
import { GameContext } from "../../../actions/classes/game-context.interface";

@Component({
    selector: 'active-layer',
    standalone: true,
    imports: [ActionSelectorComponent],
    templateUrl: './active.layer.component.html',
})
export class ActiveLayerComponent implements OnInit {

    currentAction!: Type<Action>

    constructor(
        private mouseEvent: MouseEventService,
        private gameContext: GameContextService,
        private store: Store,
        private injector: Injector
    ) {}

    ngOnInit(): void {
        this.initMouseEventSubscriptions();

        this.store.select(getCurrentAction())
        .pipe(filter(action => !!action))
        .subscribe(currentAction => {  
            this.currentAction = currentAction
        })
    }

    initMouseEventSubscriptions() {
        this.mouseEvent.getMouseEvents().subscribe(mouseEvent => {     
            const baseContext: BaseContext = {
                mouseEventType: mouseEvent.type,
                hex: mouseEvent.hex,
            }
            this.gameContext.generateGameContext(baseContext).subscribe(gameContext => {  
                this.generateSelectableActions(gameContext) 
                this.handleCurrentAction(gameContext)
            })               
        });
    } 
    
    handleCurrentAction(gameContext: GameContext) {
        if (this.currentAction) {
            const action = this.injector.get(this.currentAction)

            const activeStep = action.getSteps()
                .map(step => this.injector.get(step))
                .find(step => step.identify(gameContext))

            if (activeStep) {
                activeStep.calculation(gameContext)
                activeStep.updateState(gameContext) 
            }            
        }    
    }
       
    generateSelectableActions(gameContext: GameContext) {
        const selectableActions = gameContext.availableActions.filter(availableAction => {
            const action = new availableAction()                    
            return action.identify(gameContext)
        })                
        if (selectableActions.length) {
            this.store.dispatch(setSelectableActions({ actions: selectableActions }))
            this.store.dispatch(clearStepMeta())
            const firstSelectableAction: Type<Action> = selectableActions[0]
            this.store.dispatch(setCurrentAction({ action: firstSelectableAction }))    
            this.currentAction = firstSelectableAction
        }
    }

}