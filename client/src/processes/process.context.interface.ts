import { Player } from "../models/player.model";
import { ProcessType } from "./process.type.enum";

export interface ProcessContext {
    player: Player | undefined,
    activeProcessType: ProcessType | undefined
}