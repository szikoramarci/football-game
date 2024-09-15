import { ProcessRule } from "../process.rule.interface";

export class IsOwnPlayer implements ProcessRule {
    isValid(context: any): boolean {
        return context.player.own;
    }
    errorMessage = "pick from your own players";
}