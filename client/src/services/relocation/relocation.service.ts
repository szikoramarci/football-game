import { Injectable } from "@angular/core";
import { RelocationScenario } from "../../relocation/relocation-scenario.interface";
import { Player } from "../../models/player.model";
import { Store } from "@ngrx/store";
import { setScenario } from "../../stores/relocation/relocation.actions";

@Injectable({
    providedIn: 'root'
})
export class RelocationService {

    constructor(
        private store: Store
    ) {}

    startScenario() {
        const movementPhase: RelocationScenario = {
            name: 'movementPhase',
            turns: [
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
        }

        this.store.dispatch(setScenario({ scenario: movementPhase }))
    }

    resetScenario() {

    }

    isScenarioActive() {

    }
}