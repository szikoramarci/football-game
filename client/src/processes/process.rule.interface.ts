import { ProcessContext } from "./process.context.interface";

export interface ProcessRule {
    isValid(context: ProcessContext): boolean;
    errorMessage: string;
}