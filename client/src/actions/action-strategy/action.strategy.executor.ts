import { ActionContext } from "../action-context/action.context.interface";
import { ActionStrategy } from "./action.strategy.interface";

export class ActionExecutor {
    executeAction(context: ActionContext): void {
      const action = this.getActionForContext(context);
  
      if (action && action.identify(context)) {
        action.calculation(context);
        action.triggerVisual(context);
        action.updateState(context);
      } else {
        console.log("Nem érvényes akció.");
      }
    }
  
    private getActionForContext(context: ActionContext): ActionStrategy {
      // Visszaadjuk a megfelelő stratégiát az ActionState alapján
      switch (context.actionState.getActionType()) {
        case ActionType.PICKUP:
          return new PickUpStrategy();
        case ActionType.SET_PATH:
          return new SetPathStrategy();
        case ActionType.MOVE:
          return new MoveStrategy();
        default:
          throw new Error("Ismeretlen akció típus.");
      }
    }
  }