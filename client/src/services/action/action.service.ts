import { Injectable, Injector } from "@angular/core";
import { Step } from "../../action-steps/classes/step.class";
import { ActionContext } from "../../action-steps/classes/action-context.interface";
import { Action } from "../../actions/action.interface";
import { standardPassAction } from "../../actions/standard-pass.action";
import { highPassAction } from "../../actions/high-pass.action";
import { movingAction } from "../../actions/moving.action";
import { Store } from "@ngrx/store";
import { clearStepMeta, setAvailableActions, setCurrentAction } from "../../stores/action/action.actions";
import { getCurrentAction, getCurrentStepIndex } from "../../stores/action/action.selector";
import { filter } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class ActionService {

  currentAction!: Action

  constructor(
    private store: Store,
    private injector: Injector
  ) {
    this.initSubscriptions()
  }

  initSubscriptions() {
    this.store.select(getCurrentAction())
      .pipe(filter(action => !!action))
      .subscribe(currentAction => {  
          this.currentAction = currentAction
          console.log(currentAction.name)
      })
  }  

  startAction(context: ActionContext) {
    if (this.currentAction) {
      for (const step of this.currentAction.steps) {
        const stepInstance = this.injector.get(step);
        if (stepInstance.identify(context)) {
          stepInstance.calculation(context);
          stepInstance.updateState(context);
          return;
        }
      }
    }    
  }

  setCurrentAction(actionContext: ActionContext){
    const actions: Action[] = [
      movingAction
    ]
    if (actionContext.playerHasBall) {
      actions.push(standardPassAction, highPassAction)
    }
    this.store.dispatch(clearStepMeta())
    this.store.dispatch(setAvailableActions({ actions: actions }))
    this.store.dispatch(setCurrentAction({ action: actions[0] }))    
  }

}