import { Injectable } from "@angular/core";
import { Player } from "../../models/player.model";
import { Store } from "@ngrx/store";
import { initScenario, unshiftScenarioTurn } from "../../stores/relocation/relocation.actions";
import { RelocationTurn } from "../../relocation/relocation-turn.interface";

@Injectable({
    providedIn: 'root'
})
export class RelocationService {

    movementPhase: RelocationTurn[] = [
        {
            team: 'barca',
            movementType: 'steps',
            movementLimit: 'ownSpeed',
        },
        {
            team: 'barca',
            movementType: 'steps',
            movementLimit: 'ownSpeed',
        },
        {
            team: 'real',
            movementType: 'steps',
            movementLimit: 'ownSpeed',
        },
        {
            team: 'real',
            movementType: 'steps',
            movementLimit: 'ownSpeed',
        },
        {
            team: 'barca',
            movementType: 'steps',
            movementLimit: 2,
        }
    ]

    constructor(
        private store: Store
    ) {}


    generateMovementPhase() {
        return this.movementPhase
    }    
}