import { Component, Injector, OnInit, Type } from "@angular/core";
import { MouseEventService } from "../../../services/mouse-event/mouse-event.service";
import { ActionSelectorComponent } from "../../action-selector/action-selector.component";
import { BaseContext } from "../../../actions/classes/base-context.interface";
import { GameContextService } from "../../../services/game-context/game-context.service";
import { Store } from "@ngrx/store";
import { clearCurrentAction, clearGameContext, clearStepMeta, setCurrentAction, setGameContext, setSelectableActions } from "../../../stores/action/action.actions";
import { getCurrentAction, getGameContext } from "../../../stores/action/action.selector";
import { Action } from "../../../actions/classes/action.class";
import { GameContext } from "../../../actions/classes/game-context.interface";
import { MouseTriggerEventType } from "../../../services/mouse-event/mouse-event.interface";

@Component({
    selector: 'active-layer',
    standalone: true,
    imports: [ActionSelectorComponent],
    templateUrl: './active.layer.component.html',
})
export class ActiveLayerComponent implements OnInit {

    currentAction: Type<Action> | undefined = undefined
    currentGameContext: GameContext | undefined = undefined

    constructor(
        private mouseEvent: MouseEventService,
        private gameContext: GameContextService,
        private store: Store,
        private injector: Injector
    ) {}

    ngOnInit(): void {
        this.initMouseEventSubscriptions();

        this.store.select(getGameContext())
        .subscribe(gameContext => {  
            this.currentGameContext = gameContext                         
        })

        this.store.select(getCurrentAction())
        .subscribe(currentAction => {  
            this.currentAction = currentAction             
            this.handleCurrentAction(this.currentGameContext!)        
        })
    }

    initMouseEventSubscriptions() {
        this.mouseEvent.getMouseEvents().subscribe(mouseEvent => {     
            if (mouseEvent.type === MouseTriggerEventType.RIGHT_CLICK) {
                this.store.dispatch(clearStepMeta())     
                this.store.dispatch(setSelectableActions({ actions: [] }))                                           
                this.store.dispatch(clearGameContext())      
                this.store.dispatch(clearCurrentAction())  
                return 
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

                    if (selectableActions.length) {
                        const firstSelectableAction: Type<Action> = selectableActions[0]
                        this.currentAction = firstSelectableAction  
                        gameContext.lastStepMeta = undefined
                        this.store.dispatch(clearStepMeta())     
                        this.store.dispatch(setSelectableActions({ actions: selectableActions }))                                                                                                                      
                        this.store.dispatch(setGameContext({ gameContext }))        
                        this.store.dispatch(setCurrentAction({ action: firstSelectableAction }))    
                        console.log('RESTART')  
                    } else {                                                                                                                
                        this.handleCurrentAction(gameContext)   
                    }                                
                })

                
            }                         
        });
    } 
    
    handleCurrentAction(gameContext: GameContext) {
        if (this.currentAction) {
            console.log('HANDLE ACTION')
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

}