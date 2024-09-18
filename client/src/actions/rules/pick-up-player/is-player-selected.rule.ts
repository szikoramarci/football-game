import { ActionContext } from "../../interfaces/action.context.interface";

export class IsPlayerSelected implements ActionRule {
    isValid(context: ActionContext): boolean {
        return !!context.player;
    }
    errorMessage = "pick a player";
}