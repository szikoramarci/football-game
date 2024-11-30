import { Injectable, Injector } from "@angular/core";
import { Step } from "../../action-steps/classes/step.class";
import { ActionContext } from "../../action-steps/classes/action-context.interface";
import { Action } from "../../actions/action.interface";
import { standardPassAction } from "../../actions/standard-pass.action";
import { highPassAction } from "../../actions/high-pass.action";
import { movingAction } from "../../actions/moving.action";
import { Store } from "@ngrx/store";
import { setAvailableActions, setCurrentAction } from "../../stores/action/action.actions";

@Injectable({
    providedIn: 'root',
})
export class ActionService {

  stepList: Step[] = [];

  constructor(
    private store: Store,
    private injector: Injector
  ) {}

  startAction(action: Action, context: ActionContext) {
    for (const step of action.steps) {
      const stepInstance = this.injector.get(step);
      if (stepInstance.identify(context)) {
        stepInstance.calculation(context);
        stepInstance.updateState(context);
        return;
      }
    }
  }


  setAvailableActions(actionContext: ActionContext){
    const actions: Action[] = [
      movingAction
    ]
    if (actionContext.playerHasBall) {
      actions.push(standardPassAction, highPassAction)
    }
    this.store.dispatch(setAvailableActions({ actions: actions }))
    this.store.dispatch(setCurrentAction({ action: actions[0] }))
    this.startAction(actions[0], actionContext)
  }

}