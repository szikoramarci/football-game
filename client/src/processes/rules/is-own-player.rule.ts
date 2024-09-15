import { ProcessContext } from "../process.context.interface";
import { ProcessRule } from "../process.rule.interface";

export class IsOwnPlayer implements ProcessRule {
    isValid(context: ProcessContext): boolean {
        return true;
    }
    errorMessage = "pick from your own players";
}