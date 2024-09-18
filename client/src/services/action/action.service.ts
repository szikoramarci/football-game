import { Injectable } from "@angular/core";
import { ActionContext } from "../../actions/interfaces/action.context.interface";
import { ActionStrategy } from "../../actions/interfaces/action.strategy.interface";
import { PickUpPlayerAction } from "./pick-up-player/pick-up-player.action.service";

@Injectable({
    providedIn: 'root',
})
export class ActionService {

  actionList: ActionStrategy[] = [];

  constructor(private pickUpPlayer: PickUpPlayerAction) {
    this.actionList = [
      this.pickUpPlayer
    ]
  }

  resolveAction(context: ActionContext): ActionStrategy | null {
    for (const action of this.actionList) {
      if (action.identify(context)) {
        return action;
      }
    }

    return null; 
  }

  executeAction(action: ActionStrategy, context: ActionContext): void {    
    if (action) {
      action.calculation(context);
      action.triggerVisual(context);
      action.updateState(context);
    } else {
      console.log("Invalid action.");
    }
  }

}