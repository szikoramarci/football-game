import { Injectable } from "@angular/core";
import { ActionContext } from "../../actions/interfaces/action.context.interface";
import { ActionStrategy } from "../../actions/interfaces/action.strategy.interface";
import { PickUpPlayerAction } from "./pick-up-player/pick-up-player.action.service";
import { SetMovingPathAction } from "./set-moving-path/set-moving-path.action.service";
import { MovePlayerAction } from "./move-player/move-player.action.service";
import { CancelMovingPlayerAction } from "./cancel-moving-player/cancel-moving-player.service";

@Injectable({
    providedIn: 'root',
})
export class ActionService {

  actionList: ActionStrategy[] = [];

  constructor(
    private pickUpPlayer: PickUpPlayerAction,
    private setMovingPath: SetMovingPathAction,
    private movePlayer: MovePlayerAction,
    private cancelMovingPlayer: CancelMovingPlayerAction
  ) {
    this.actionList = [
      this.pickUpPlayer,
      this.setMovingPath,
      this.movePlayer,
      this.cancelMovingPlayer
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
      action.updateState(context);
    } else {
      console.log("Invalid action.");
    }
  }

}