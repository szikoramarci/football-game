import { ProcessContext } from "../process.context.interface";
import { ProcessRule } from "../process.rule.interface";

export class IsPlayer implements ProcessRule {
    isValid(context: ProcessContext): boolean {
        return !!context.player;
    }
    errorMessage = "pick a player";
}