import { ProcessContext } from "./process.context.interface";
import { ProcessType } from "./process.type.enum";

export interface Process {
    processType: ProcessType,
    context: ProcessContext
}