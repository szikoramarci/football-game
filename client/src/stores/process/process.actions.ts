import { createAction, props } from "@ngrx/store";
import { Process } from "../../processes/process.interface";

export const startProcess = createAction(
    '[Process] Start Process',
    props<Process>()
);

export const stopProcess = createAction('[Process] Stop Process');