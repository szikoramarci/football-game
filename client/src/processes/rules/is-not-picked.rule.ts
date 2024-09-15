import { ProcessContext } from "../process.context.interface";
import { ProcessRule } from "../process.rule.interface";
import { ProcessType } from "../process.type.enum";

export class IsNotPicked implements ProcessRule {
    isValid(context: ProcessContext): boolean {
        return context.activeProcessType == ProcessType.PickPlayer;
    }
    errorMessage = "pick a player first";
}