export interface ProcessRule {
    isValid(context: any): boolean;
    errorMessage: string;
}