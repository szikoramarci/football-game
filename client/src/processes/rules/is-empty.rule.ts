import { ProcessContext } from "../process.context.interface";
import { ProcessRule } from "../process.rule.interface";

export class IsEmpty implements ProcessRule {
    isValid(context: ProcessContext): boolean {
        return !context.player;
    }
    errorMessage = "choose an empty field";
}